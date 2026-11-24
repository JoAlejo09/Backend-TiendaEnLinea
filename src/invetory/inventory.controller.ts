import { Body, Controller, Get, Param, ParseIntPipe, Post, Session, UseGuards } from "@nestjs/common";
import { InventoryService } from "./inventory.service.js";
import { AuthGuard } from "../users/auth.guard.js";
import { RolesGuard } from "../users/roles.guard.js";
import { Roles } from "../users/decorators/roles.decorators.js";
import { UserRole } from "../users/entities/user.entity.js";
import { CreateInventoryMovementDto } from "./dto/create-inventory-movement.dto.js";

@Controller('inventory')
export class InventoryController{
    constructor(private readonly inventory:InventoryService){}

    @Post('movements')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    registerManualMovement(@Body() data:CreateInventoryMovementDto,
        @Session() session: { userId: number}
    ){
        return this.inventory.registerManualMovement(data,session.userId)
    }

    @Get('products/:productId/movements')
    @UseGuards(AuthGuard,RolesGuard)
    @Roles(UserRole.ADMIN)
    async findMovementsByProduct(@Param('productId', ParseIntPipe) productId:number){
        return await this.inventory.findMovementsByProduct(productId);
        
    }
}