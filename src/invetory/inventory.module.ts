import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { InventoryController } from "./inventory.controller.js";
import { InventoryService } from "./inventory.service.js";
import { InventoryMovement } from "./entities/inventory-movement.entity.js";
import { Product } from "../catalog/entities/product.entity.js";
import { User } from "../users/entities/user.entity.js";
import { RolesGuard } from "../users/roles.guard.js";
import { AuthGuard } from "../users/auth.guard.js";
import { UsersModule } from "../users/users.module.js";

@Module({
    imports:[TypeOrmModule.forFeature([InventoryMovement, Product, User]), UsersModule],
    controllers:[InventoryController],
    providers:[InventoryService,RolesGuard, AuthGuard],
    exports:[TypeOrmModule, InventoryService,AuthGuard, RolesGuard]
})
export class InventoryModule {}