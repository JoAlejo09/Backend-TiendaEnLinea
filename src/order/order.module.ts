import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Order } from "./entities/order.entity.js";
import { OrderItem } from "./entities/order-item.entity.js";
import { OrderService } from "./orders.service.js";
import { OrderController } from "./orders.controller.js";
import { UsersModule } from "../users/users.module.js";
import { RolesGuard } from "../users/roles.guard.js";
import { AuthGuard } from "../users/auth.guard.js";

@Module({
    imports:[TypeOrmModule.forFeature([Order,OrderItem]),UsersModule],
    providers:[OrderService, RolesGuard, AuthGuard],
    controllers:[OrderController],
    exports:[TypeOrmModule, OrderService]
})

export class OrderModule {}