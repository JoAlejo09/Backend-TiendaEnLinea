import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import type { Relation} from "typeorm";
import type { User } from "../../users/entities/user.entity.js";
import { OrderItem } from "./order-item.entity.js";
import { Payment } from "../../payment/entities/payment.entity.js";
import { Invoice } from "../../invoice/entities/invoice.entity.js";

export enum OrderStatus{
    PENDIENTE = 'PENDIENTE',
    PAGADO = 'PAGADO',
    CANCELADO = 'CANCELADO'
}

export enum FulfillmentType{
    DOMICILIO = 'DOMICILIO',
    RETIRO = 'RETIRO'
}

@Entity('orders')
export class Order{

@PrimaryGeneratedColumn({name:'id_order'})
id!:number

@Column({name:'order_code',type:'varchar',unique:true, length:30})
orderCode!:string

@ManyToOne('User',{
    nullable:false,
    onDelete:'RESTRICT'
})
@JoinColumn({
    name:'id_user',
    referencedColumnName:'id'
})
user!: Relation<User>

@Column({type:'enum', enum:OrderStatus, default:OrderStatus.PENDIENTE})
status!: OrderStatus;

@Column({type:'enum', enum:FulfillmentType})
fulfillmentType!:FulfillmentType

@Column({name:'delivery_address', type:'text', nullable:true})
deliveryAddress!:string | null;

@Column({type:'numeric',precision:10,scale:2})
subtotal!:string

@Column({type:'numeric',precision:10,scale:2})
deliveryCost!:string

@Column({type:'numeric',precision:10,scale:2})
total!:string

@CreateDateColumn({name:'created_at', type:'timestamptz'})
createdAt!: Date;

@UpdateDateColumn({name:'updated_at', type:'timestamptz'})
updatedAt!: Date;

@OneToMany('OrderItem',
    (item:OrderItem)=> item.order,
)
items!: Relation<OrderItem[]>

@OneToOne(()=>Payment, payment => payment.order)
payment?: Relation<Payment> | null;

@OneToOne(()=>Invoice, invoice => invoice.order)
invoice?: Relation<Invoice> | null;
}