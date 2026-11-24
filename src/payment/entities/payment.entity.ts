import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import type { Relation} from 'typeorm';
import { Order } from "../../order/entities/order.entity.js";

export enum PaymentStatus{
    PENDIENTE = 'PENDIENTE',
    APROBADO = 'APROBADO',
    RECHAZADO = 'RECHAZADO'
}

export enum PaymentMethod{
    TARJETA_SIMULADA = 'TARJETA_SIMULADA'
}

@Entity({name:'payment'})
export class Payment{
    @PrimaryGeneratedColumn({name:'id_payment'})
    id!:number

    @OneToOne(()=>Order, order=>order.payment)
    @JoinColumn({name:'id_order'})
    order!:Relation<Order>

    @Column({type:'enum',enum:PaymentStatus, default:PaymentStatus.PENDIENTE})
    status!:PaymentStatus

    @Column({type:'enum',enum:PaymentMethod, default:PaymentMethod.TARJETA_SIMULADA})
    method!:PaymentMethod

    @Column ({type:'numeric',precision:10,scale:2})
    amount!:string

    @Column({name:'transaction_reference',type:'varchar', length:30})
    transactionReferenced!:string

    @Column({name:'failure_reason', type:'text', nullable:true})
    failureReason!: string | null;

    @CreateDateColumn({name:'created_at',type:'timestamptz'})
    createdAt!:Date

    @Column({name:'processed_at', type:'timestamptz', nullable:true})
    processedAt!:Date | null;

}
