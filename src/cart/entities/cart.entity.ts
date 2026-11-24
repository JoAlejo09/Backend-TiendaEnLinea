import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "../../users/entities/user.entity.js";
import type { Relation} from 'typeorm';
import { CartItem } from "./cart-items.entity.js";
@Entity({name:'carts'})
export class Cart{
    @PrimaryGeneratedColumn({name:'id_cart'})
    id!:number

    @ManyToOne('User', 
        {
        nullable: true,
        onDelete:'RESTRICT'
        }
    )
    @JoinColumn({
        name:'id_user',
        referencedColumnName:'id'
    })
    user?: Relation<User> | null;

    @Column({name:'is_active', type:'boolean', default:true})
    isActive!:boolean
    
    @CreateDateColumn({name:'created_at', type:'timestamptz'})
    createdAt!: Date;

    @UpdateDateColumn({name:'modified_at', type:'timestamptz'})
    modifiedAt!: Date;

    @OneToMany('CartItem', (item: CartItem)=>item.cart
    )
    items!: Relation<CartItem []>;
}