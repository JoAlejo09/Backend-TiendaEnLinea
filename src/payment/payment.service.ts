import { ConflictException, Inject, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { DataSource } from "typeorm";
import { Payment, PaymentMethod, PaymentStatus } from "./entities/payment.entity.js";
import { Order, OrderStatus } from "../order/entities/order.entity.js";
import { Product } from "../catalog/entities/product.entity.js";
import { randomUUID } from "crypto";
import { InventoryMovement, MovementReason } from "../invetory/entities/inventory-movement.entity.js";
import { User } from "../users/entities/user.entity.js";
import { InvoiceService } from "../invoice/invoice.service.js";
import { CustomerProfile } from "../users/entities/customer-profile.entity.js";

type SimulatedPaymentResult = {
    status: PaymentStatus,
    transactionReference:string,
    failureReason: string | null
}

@Injectable()
export class PaymentService{
    constructor(private readonly dataSource:DataSource,
        private readonly invoices:InvoiceService
    ){}

    async processPayment(orderId:number, session:{userId:number}){

        return this.dataSource.transaction(async (manager)=>{
            const orders = manager.getRepository(Order);
            const products = manager.getRepository(Product)
            const payments = manager.getRepository(Payment)

            const order = await orders.findOne({
                where:{
                    id:orderId,
                    user:{id:session.userId}
                },
                relations:{
                    items:{
                        product:true
                    }
                }
            })
            if(!order){
                throw new NotFoundException('No se ha encontrado el pedido correspondiente para realizar el pago')
            }
            if(order.status !== OrderStatus.PENDIENTE){
                throw new ConflictException('El pedido ya ha sido procesado anteriormente....')
            }
            const lockedProducts: Product[] = []
            for(const item of order.items){
                const product = await products.findOne({
                    where:{
                        id: item.product.id,
                        isActive:true
                    },
                    lock:{
                        mode:'pessimistic_write'
                    }
                });

                if(!product){
                    throw new ConflictException(`El producto ${item.productName} ya no esta disponible`)
                }
                if(product.stock < item.quantity){
                    throw new ConflictException(`Stock insuficiente de ${item.productName}`)
                }
                lockedProducts.push(product)
            }
            const simulated = this.simulatedPayment();

            let payment = await payments.findOne({
                    where:{order:{id:orderId}}
            })
            if(!payment){
                payment = payments.create({order})
            }
            payment.status = simulated.status;
            payment.method = PaymentMethod.TARJETA_SIMULADA;
            payment.amount = order.total
            payment.transactionReferenced = simulated.transactionReference;
            payment.failureReason = simulated.failureReason;
            payment.processedAt = new Date();
            const savedPayment = await payments.save(payment)
            
            if(simulated.status === PaymentStatus.RECHAZADO){
                return {
                    orderCode: order.orderCode,
                    orderStatus: order.status, // sigue PENDIENTE
                    paymentStatus: savedPayment.status,
                    failureReason: savedPayment.failureReason,
                    total: order.total,
                };
            }
            else if(simulated.status === PaymentStatus.APROBADO){               
                const movements = manager.getRepository(InventoryMovement);
                const users = manager.getRepository(User)

                const user = await users.findOneBy({
                    id:session.userId,
                    isActive:true
                })

                if(!user){
                    throw new UnauthorizedException('La sesión no corresponde a un usuario activo');
                }

                for(const item of order.items){
                    const product = lockedProducts.find(
                        (candidate)=>candidate.id === item.product.id
                    )
                    if (!product) {
                        throw new ConflictException('No se pudo validar un producto del pedido');
                    }
                    const stockBefore = product.stock;
                    const quantityChange = -item.quantity;
                    const stockAfter = stockBefore + quantityChange;

                    product.stock = stockAfter;
                    await products.save(product)

                    const movement = movements.create({
                        product,
                        user:user,
                        reason: MovementReason.VENTA,
                        quantityChange,
                        stockBefore,
                        stockAfter
                    })
                    await movements.save(movement)
                }
                order.status = OrderStatus.PAGADO
                const saveOrder = await orders.save(order)

                const customerProfiles = manager.getRepository(CustomerProfile)
                const customer = await customerProfiles.findOne({
                    where:{
                        user:{id:session.userId,isActive:true}
                    }
                })
                if(!customer){
                    throw new NotFoundException('Usuario no encontrado')
                }
                const invoice = await this.invoices.createInvoiceForPaidOrder(manager,order,customer)
                return{
                    message:`Pago realizado generado factura ${invoice.invoiceNumber}`,
                    orderId: saveOrder.id,
                    orderCode: saveOrder.orderCode,
                    orderStatus: saveOrder.status,
                    payment:{
                        status: savedPayment.status,
                        method: savedPayment.method,
                        amount: savedPayment.amount,
                        transactionReference: savedPayment.transactionReferenced,
                        failureReason: savedPayment.failureReason,
                        processedAt: savedPayment.processedAt,
                    }
                }
            }
            
        })
    }
    private simulatedPayment(): SimulatedPaymentResult{
        const approved = Math.random() < 0.7;
        return{
            status:approved
            ? PaymentStatus.APROBADO
            : PaymentStatus.RECHAZADO,
            transactionReference: `SIM-${randomUUID().replaceAll('-','').slice(0,26)}`,
            failureReason: approved ? null: 'Pago simulado rechazado'
        }
    }


}