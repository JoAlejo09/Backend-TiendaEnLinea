import { DataSource, Repository } from "typeorm";
import { CreateInventoryMovementDto } from "./dto/create-inventory-movement.dto.js";
import { Product } from "../catalog/entities/product.entity.js";
import { InventoryMovement, MovementReason } from "./entities/inventory-movement.entity.js";
import { User } from "../users/entities/user.entity.js";
import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class InventoryService{
    
    constructor( private readonly dataSource: DataSource){}

    async registerManualMovement(
        data:CreateInventoryMovementDto,
        userId:number
    ){
        switch(data.reason){
            case MovementReason.REPOSICION:
            case MovementReason.DEVOLUCION:
                if(data.direction !== 'IN'){
                    throw new BadRequestException('La reposición y la devolución deben aumentar el stock')
                }
                break;
            case MovementReason.DEFECTUOSO:
                if (data.direction !== 'OUT') {
                    throw new BadRequestException('Un producto defectuoso debe reducir el stock disponible',);
                }
                break;
             case MovementReason.AJUSTE:
                // El ajuste puede aumentar o reducir el stock.
                break;
            case MovementReason.VENTA:
                throw new BadRequestException('Las ventas se registran desde el proceso del pedido',);
        }
        return this.dataSource.transaction(async (manager)=>{
            const products = manager.getRepository(Product);
            const movements = manager.getRepository(InventoryMovement);
            const users = manager.getRepository(User);

            const product = await products.findOne({
                where:{ id:data.productId,
                    isActive:true,
                },
                lock:{mode:'pessimistic_write'}
            });
            if(!product){
                throw new NotFoundException('Producto no encontrado o inactivo')
            }
            const quantityChange= data.direction === 'IN' ? data.quantity : -data.quantity
            
            const stockBefore = product.stock;
            const stockAfter = stockBefore + quantityChange;

            if(stockAfter<0){
                throw new BadRequestException('El stock no puede ser menor a 0');
            }

            const actor = await users.findOneBy({
                id:userId,
                isActive:true
            });
            if(!actor){
                throw new UnauthorizedException('La sesión no es válida');
            }

            product.stock = stockAfter;
            await products.save(product);

            const movement = movements.create({
                product,
                user:actor,
                reason:data.reason,
                quantityChange,
                stockBefore,
                stockAfter
            });
            const savedMovement = await movements.save(movement)
            return {
                id: savedMovement.id,
                productId: product.id,
                reason: savedMovement.reason,
                quantityChange: savedMovement.quantityChange,
                stockBefore: savedMovement.stockBefore,
                stockAfter: savedMovement.stockAfter,
                createdAt: savedMovement.createdAt,
};
        })
    }

    async findMovementsByProduct(productId:number){
        const products = this.dataSource.getRepository(Product);
        const movementData = this.dataSource.getRepository(InventoryMovement);

        const product = await products.findOneBy({
            id:productId
        })
        if(!product){
            throw new NotFoundException('No existe el producto')
        }
        const movements= await movementData.find({
            where:{
                product:{id:productId}
            },
            relations:{
                user:true,
                product:true
            },
            select:{
                id:true,
                reason:true,
                quantityChange:true,
                stockBefore:true,
                stockAfter:true,
                createdAt:true,
                product:{
                    id:true,
                    name:true
                },
                user:{
                    id:true,
                    email:true,
                    profile:{
                        firstName:true,
                        lastName:true,
                    }
                }
            },
            order:{
                createdAt:'DESC'
            }
        })

        return(movements.map((movement)=>({
            id: movement.id,
            productName: movement.product.name,
            modifiedBy: [movement.user.profile?.firstName, movement.user.profile?.lastName]
                .filter(Boolean)
                .join(' ') || movement.user.email,
            name:movement.product.name,
            userId:movement.user.id,
            reason: movement.reason,
            quantityChange:movement.quantityChange,
            stockBefore: movement.stockBefore,
            stockAfter:movement.stockAfter,
            createdAt:movement.createdAt
        })));
    }
}