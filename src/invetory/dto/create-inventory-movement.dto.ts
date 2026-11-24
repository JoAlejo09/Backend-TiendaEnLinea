import { IsIn, IsInt, IsString, Min, NotEquals } from "class-validator";
import { MovementReason } from "../entities/inventory-movement.entity.js";

export class CreateInventoryMovementDto{
    @IsInt()
    @Min(1)
    productId!:number

    @IsIn([
        MovementReason.AJUSTE,
        MovementReason.DEVOLUCION,
        MovementReason.REPOSICION,
        MovementReason.DEFECTUOSO
    ])
    reason!:MovementReason

    @IsIn(['IN','OUT'])
    direction!: 'IN' | 'OUT'

    @IsInt()
    @NotEquals(0)
    quantity!:number
}