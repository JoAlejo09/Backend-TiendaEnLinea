import { Check, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import type { Relation } from 'typeorm';
import type { Subcategory } from './subcategory.entity.js';

@Entity({name:'products'})
@Check('CHK_products_price_positive', '"price" > 0')
@Check('CHK_products_stock_non_negative', '"stock" >= 0')

export class Product {
    @PrimaryGeneratedColumn({name:'id_product'})
    id!:number

    @Column({
        name:'code_product',
        type:'varchar',
        length:30,
        unique:true
    })
    code!:string;

    @Column({type:'varchar', length:150})
    name!:string
    
    @Column({type:'varchar', length:100})
    brand!:string

    @Column({type:'varchar', nullable:true})
    characteristics!:string|null;
    
    @Column({type:'varchar', length:100})
    presentation!:string

    @Column({type:'numeric', precision:10, scale:2})
    price!:string

    @Column({type:'integer', default:0})
    stock!:number

    @Column({type:'text', nullable:true})
    description!:string | null;

    @Column({name:'is_active', type:'boolean', default:true})
    isActive!:boolean;

    @ManyToOne('Subcategory',{
        nullable:false,
        onDelete:'RESTRICT'
    })
    @JoinColumn({
        name:'id_subcategory', referencedColumnName:'id'
    })
    subcategory!:Relation<Subcategory>

}