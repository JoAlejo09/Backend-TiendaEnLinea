import { Check, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from 'typeorm'
import type { Relation } from 'typeorm';
import type { Product } from '../../catalog/entities/product.entity.js';
import type { User } from '../../users/entities/user.entity.js';
export enum MovementReason{
    REPOSICION = 'REPOSICION',
    VENTA = 'VENTA',
    AJUSTE = 'AJUSTE',
    DEVOLUCION = 'DEVOLUCION',
    DEFECTUOSO = 'DEFECTUOSO'
}

@Check(
  'CHK_inventory_movement_quantity_change_nonzero',
  '"quantityChange" <> 0',
)
@Check(
  'CHK_inventory_movement_stock_nonnegative',
  '"stockBefore" >= 0 AND "stockAfter" >= 0',
)
@Check(
  'CHK_inventory_movement_stock_consistent',
  '"stockAfter" = "stockBefore" + "quantityChange"',
)


@Entity({name:'inventory_movements'})
export class InventoryMovement{
    @PrimaryGeneratedColumn({name:'id_movement'})
    id!: number;
    
    //Relacion con Product
    @ManyToOne('Product',{
        nullable:false,
        onDelete:'RESTRICT'
    })
    @JoinColumn({
        name:'id_product',
        referencedColumnName:'id'
    })
    product!: Relation<Product>

    //Relacion con User
    @ManyToOne('User',{
        nullable: false,
        onDelete: 'RESTRICT'
    })
    @JoinColumn({
        name:'id_user',
        referencedColumnName:'id'
    })
    user!: Relation<User>

    @Column({
        type:'enum',
        enum:MovementReason,
    })
    reason!: MovementReason;

    @Column({type:'integer'})
    quantityChange!:number

    @Column({ type: 'integer' })
    stockBefore!: number;
    
    @Column({ type: 'integer' })
    stockAfter!: number;

    @CreateDateColumn({name:'created_at', type:'timestamptz'})
    createdAt!: Date;

}