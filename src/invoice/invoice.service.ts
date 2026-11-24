import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { DataSource, EntityManager } from "typeorm";
import { Order, OrderStatus } from "../order/entities/order.entity.js";
import { CustomerProfile } from "../users/entities/customer-profile.entity.js";
import { Invoice } from "./entities/invoice.entity.js";
import { randomUUID } from "crypto";

@Injectable()
export class InvoiceService{
    constructor(private readonly dataSource:DataSource){}

    async createInvoiceForPaidOrder(manager:EntityManager, order:Order, customerProfile:CustomerProfile):Promise<Invoice>{
        if(order.status !== OrderStatus.PAGADO){
            throw new ConflictException('El Pedido no ha sigo pagado para poder generar la factura')
        }
        const invoiceData = manager.getRepository(Invoice)
        const existing = await invoiceData.findOne({
            where:{
                order:{id:order.id}
            }
        })
        if(existing){
              throw new ConflictException('El pedido ya tiene una factura');
        }
        const invoiceNumber = `FACT-${randomUUID().replaceAll('-','').slice(0,25)}`

        const invoice= invoiceData.create({
            invoiceNumber,
            order,
            customerName:customerProfile.firstName,
            customerLastName: customerProfile.lastName,
            identification: customerProfile.identification,
            billingAddress: customerProfile.address,
            phone: customerProfile.phone
        })
        return invoiceData.save(invoice)

    }

    async findInvoiceByOrderForUser(orderId:number, userId:number){
        const invoices=this.dataSource.getRepository(Invoice)
        const invoice = await invoices.findOne({
            where:{
                order:{id:orderId,
                    user:{id:userId},
                    status:OrderStatus.PAGADO
                },
            },
            relations:{
                order:{
                    items:true,
                }
            }
        })
        if(!invoice){
            throw new NotFoundException('No se ha encontrado la factura')
        }
        return{
            invoiceNumber: invoice.invoiceNumber,
            issuedAt: invoice.issuedAt,
            customer:{
                name:invoice.customerName,
                lastName: invoice.customerLastName,
                identification: invoice.identification,
                billingAddress: invoice.billingAddress,
                phone: invoice.phone,
            },
            order:{
                 orderCode: invoice.order.orderCode,
                fulfillmentType: invoice.order.fulfillmentType,
                deliveryAddress: invoice.order.deliveryAddress,
                subtotal: invoice.order.subtotal,
                deliveryCost: invoice.order.deliveryCost,
                total: invoice.order.total,
                items: invoice.order.items.map((item)=>({
                    productCode: item.productCode,
                    productName: item.productName,
                    productPresentation: item.productPresentation,
                    unitPrice: item.unitPrice,
                    quantity: item.quantity,
                    subtotal: item.subtotal,
                }))
            }
        }

    }
}