import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import { Cart } from "./cart.entity.js";
import type {Relation} from 'typeorm'
import { Product } from "../../catalog/entities/product.entity.js";

@Unique('UQ_cart_items_product',['cart','product'])
@Entity({name:'cart_items'})
export class CartItem{
    @PrimaryGeneratedColumn({name:'id_cart_item'})
    id!: number

    @ManyToOne('Cart',{
        nullable:false,
        onDelete: 'RESTRICT'
    })
    @JoinColumn({
        name:'id_cart',
        referencedColumnName:'id'
    })
    cart!: Relation<Cart>

    @ManyToOne('Product',{
        nullable:false,
        onDelete:'RESTRICT'
    })
    @JoinColumn({
        name:'id_product',
        referencedColumnName:'id',
    })
    product!: Relation<Product>

    @Column({name:'quantity', type:'integer'})
    quantity!:number
}