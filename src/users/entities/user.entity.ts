import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import type { Relation } from 'typeorm';
import type { CustomerProfile } from './customer-profile.entity.js';

export enum UserRole{
    CLIENT = 'CLIENT',
    ADMIN = 'ADMIN',
}

@Entity({name:'users'})
export class User{
    @OneToOne('CustomerProfile',(profile:CustomerProfile)=>profile.user)
    profile?:Relation<CustomerProfile>;
    
    @PrimaryGeneratedColumn({name:'id_user'})
    id!:number;

    @Column({type:'varchar', length:254, unique:true})
    email!:string

    @Column({name:'password_hash', type:'varchar', length:255})
    passwordHash!:string

    @Column({
        type:'enum',
        enum: UserRole,
        default: UserRole.CLIENT,
    })
    role!: UserRole

    @Column({name:'is_active', type:'boolean', default:true})
    isActive!: boolean
}