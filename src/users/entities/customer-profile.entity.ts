import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import type { Relation } from 'typeorm';
import type { User } from './user.entity.js';

@Entity({name:'customer_profiles'})
export class CustomerProfile{
    @PrimaryColumn({name:'id_user',type:'integer'})
    userId:number

    @Column({name:'first_name', type:'varchar', length:100})
    firstName!:string
    
    @Column({name:'last_name', type:'varchar', length:100})
    lastName!:string

    @Column({type:'varchar', length:20, unique:true})
    identification!:string

    @Column({type:'varchar', length:250})
    address!:string

    @Column({type:'varchar',length:30})
    phone!:string

    @OneToOne('User',{
        nullable:false,
        onDelete:'CASCADE'
    })
    @JoinColumn({name:'id_user', referencedColumnName:'id'})
    user!:Relation<User>;
}