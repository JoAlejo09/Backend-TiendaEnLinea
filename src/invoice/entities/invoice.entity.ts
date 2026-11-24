import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import type { Relation} from 'typeorm'
import { Order } from "../../order/entities/order.entity.js";

@Entity({name:'invoice'})
export class Invoice{
    @PrimaryGeneratedColumn({name:'id_invoice'})
    id!:number;
    
    @Column({name:'invoice_number', type:'varchar',length:30, unique:true})
    invoiceNumber!:string

    @OneToOne(()=>Order, order=>order.invoice,{
        nullable:false
    })
    @JoinColumn({name:'id_order'})
    order!:Relation<Order>
    
    @Column({name:'customer_name', type:'varchar', length:100})
    customerName:string

    @Column({name:'customer_last_name', type:'varchar', length:100})
    customerLastName!:string

    @Column({name:'identification', type:'varchar', length:20})
    identification!:string

    @Column({name:'billing_address', type:'varchar', length:250})
    billingAddress!:string 

    @Column({name:'phone', type:'varchar', length:30})
    phone!:string

    @CreateDateColumn({name:'issued_at', type:'timestamptz'})
    issuedAt!:Date
}