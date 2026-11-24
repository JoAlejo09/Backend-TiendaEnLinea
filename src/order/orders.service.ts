import { BadRequestException, ConflictException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { DataSource } from "typeorm";
import { CreateOrderDto } from "./dto/create-order.dto.js";
import { Cart } from "../cart/entities/cart.entity.js";
import { FulfillmentType, Order, OrderStatus } from "./entities/order.entity.js";
import { OrderItem } from "./entities/order-item.entity.js";
import { User } from "../users/entities/user.entity.js";
import { randomUUID } from 'node:crypto';

type OrderSession={
    userId?:number,
    cartId?:number
}

@Injectable()
export class OrderService{
    constructor(private readonly dataSource:DataSource,){}
    
    async createOrder(data:CreateOrderDto, session:OrderSession){
        if(!session.userId){
            throw new UnauthorizedException('No puede realizar un pedido si no esta logueado')
        }
        return this.dataSource.transaction(async (manager)=>{
            const carts = manager.getRepository(Cart)
            const orders = manager.getRepository(Order)
            const orderItems = manager.getRepository(OrderItem)
            const users = manager.getRepository(User)

            const cart = await carts.findOne({
                where:{
                    user:{id :session.userId},
                    isActive:true
                },
                relations:{
                    items:{product:true}
                }
            })

            if(!cart){
                throw new NotFoundException('No se encuentra el carrito de compras');
            }
            if(cart.items.length === 0){
                throw new BadRequestException('El carrito se encuentra vacio');
            }
            for(const item of cart.items){
                if(!item.product.isActive){
                    throw new ConflictException('Uno de los productos ya no está disponible');
                }
                if(item.quantity > item.product.stock){
                    throw new ConflictException(`No existe el stock suficiente para ${item.product.name}`)
                }
            }
            const subtotalC = cart.items.reduce(
                (sum,item)=>
                    sum + Math.round(Number(item.product.price)*100)*item.quantity
                ,0
            )
            const deliveryCostC = data.fulfillmentType === FulfillmentType.DOMICILIO ? 250 : 0;
            const totalC = subtotalC + deliveryCostC;

            const subtotal = (subtotalC/100).toFixed(2);
            const deliveryCost = (deliveryCostC/100).toFixed(2)
            const total = (totalC/100).toFixed(2);

            const user = await users.findOneBy({
                id: session.userId,
                isActive:true
            })
            if (!user) {
                throw new UnauthorizedException('La sesión no corresponde a un usuario activo');
            }
            const orderCode = `PED-${randomUUID().replaceAll('-', '').slice(0, 24).toUpperCase()}`;
            const order = orders.create({
                orderCode,
                user,
                status: OrderStatus.PENDIENTE,
                fulfillmentType: data.fulfillmentType,
                deliveryAddress:
                    data.fulfillmentType === FulfillmentType.DOMICILIO
                        ? data.deliveryAddress
                        : null,
                subtotal,
                deliveryCost,
                total
            });
            const savedOrder = await orders.save(order);

            const orderItemEntities = cart.items.map((cartItem)=>{
                const unitPriceC = Math.round(Number(cartItem.product.price)*100);
                const itemSubtotal = (
                    (unitPriceC * cartItem.quantity)/100
                ).toFixed(2)
                return orderItems.create({
                    order: savedOrder,
                    product: cartItem.product,
                    productCode: cartItem.product.code,
                    productName: cartItem.product.name,
                     productPresentation: cartItem.product.presentation,
                     unitPrice: cartItem.product.price,
                     quantity: cartItem.quantity,
                     subtotal: itemSubtotal,
                })
            })
            const savedItems = await orderItems.save(orderItemEntities)

            return {
                id: savedOrder.id,
                orderCode: savedOrder.orderCode,
                status: savedOrder.status,
                fulfillmentType: savedOrder.fulfillmentType,
                deliveryAddress: savedOrder.deliveryAddress,
                subtotal: savedOrder.subtotal,
                deliveryCost: savedOrder.deliveryCost,
                total: savedOrder.total,
                createdAt: savedOrder.createdAt,
                items: savedItems.map((item) => ({
                    productCode: item.productCode,
                    productName: item.productName,
                    productPresentation: item.productPresentation,
                    unitPrice: item.unitPrice,
                    quantity: item.quantity,
                    subtotal: item.subtotal,
                })),
            };
        })
    }

    async findOrdersByUser(userId:number){
        const ordersData = this.dataSource.getRepository(Order);
        const orders = await ordersData.find({
            where:{
                user:{id:userId},
            },
            relations:{
                items:true
            },order:{
                createdAt:'DESC'
            }
        })
        return orders;
    }

    async findOrderDetailByUser(orderId:number, userId: number){
        const ordersData = this.dataSource.getRepository(Order);
        
        const order = await ordersData.findOne({
            where:{
                id:orderId,
                user:{id:userId}
            },
            relations:{
                items:true
            }
        })
        if(!order){
            throw new NotFoundException('No se ha encontrado la orden con su usuario')
        }
        return {
            id: order.id,
            orderCode: order.orderCode,
            status: order.status,
            fulfillmentType: order.fulfillmentType,
            deliveryAddress: order.deliveryAddress,
            subtotal: order.subtotal,
            deliveryCost: order.deliveryCost,
            total: order.total,
            createdAt: order.createdAt,
            items: order.items.map((item)=>({
                productCode: item.productCode,
                productName: item.productName,
                productPresentation: item.productPresentation,
                unitPrice: item.unitPrice,
                quantity: item.quantity,
                subtotal: item.subtotal
            }))
        }
    }

    async findAllOrders(){
        const ordersData = this.dataSource.getRepository(Order)
        const orders = await ordersData.find({
            relations:{
                items:true
            },
            order:{
                createdAt:'DESC'
            }
        });
        return{
            orders:orders.map((order)=>({
                id: order.id,
                orderCode: order.orderCode,
                status: order.status,
                FulfillmentType: order.fulfillmentType,
                deliveryAdress: order.deliveryAddress,
                subtotal: order.subtotal,
                deliveryCost: order.deliveryCost,
                total: order.total,
                createdAt: order.createdAt,
                items: order.items.map((item)=>({
                    productCode: item.productCode,
                    productName: item.productName,
                    productPresentation: item.productPresentation,
                    unitPrice: item.unitPrice,
                    quantity: item.quantity,
                    subtotal: item.subtotal
                }))
            }))
        }
    }
}