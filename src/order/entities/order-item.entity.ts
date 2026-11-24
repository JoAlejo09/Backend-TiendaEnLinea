import { Check, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import type { Relation } from "typeorm";
import type { Order } from "./order.entity.js";
import type { Product } from "../../catalog/entities/product.entity.js";

@Check('CHK_quantity_positive','quantity > 0')

@Entity({name:'order_items'})
export class OrderItem{
    @PrimaryGeneratedColumn({name:'id_order_item'})
    id!:number

    @ManyToOne('Order',{
        nullable:false,
        onDelete:'RESTRICT'
    })
    @JoinColumn({
        name:'id_order',
        referencedColumnName:'id'
    })
    order!:Relation<Order>

    @ManyToOne('Product',{
        nullable:false,
        onDelete:'RESTRICT'
    })
    @JoinColumn({
        name:'id_product',
        referencedColumnName:'id'
    })
    product!:Relation<Product>
    
    @Column({name:'product_code',type:'varchar',length:30})
    productCode!:string
    
    @Column({name:'product_name',type:'varchar', length:120})
    productName!:string

    @Column({name:'product_presentation',type:'varchar', length:30})
    productPresentation!:string

    @Column({name:'unit_price',type:'numeric', precision:10, scale:2})
    unitPrice!:string

    @Column({type:'integer'})
    quantity!:number

    @Column({type:'numeric',precision:10,scale:2})
    subtotal!:string
    
}