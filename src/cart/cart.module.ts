import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CartController } from "./cart.controller.js";
import { Cart } from "./entities/cart.entity.js";
import { CartItem } from "./entities/cart-items.entity.js";
import { Product } from "../catalog/entities/product.entity.js";
import { CartService } from "./cart.service.js";

@Module({
    imports:[TypeOrmModule.forFeature([Cart, CartItem, Product]),],
    controllers:[CartController],
    providers:[CartService],
    exports:[TypeOrmModule, CartService]
})
export class CartModule {}