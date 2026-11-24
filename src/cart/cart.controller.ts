import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Session } from "@nestjs/common";
import { CartService } from "./cart.service.js";
import { AddCartItemDto } from "./dto/add-car-item.dto.js";
import { UpdateCarItemDto } from "./dto/update-car-item.dto.js";

@Controller('cart')
export class CartController{
    constructor(private readonly cartService:CartService){}

    @Get()
    getCart( @Session() session:{
        userId?:number;
        cartId?:number;
    }
    ){
        return this.cartService.getCart(session);
    }

    @Post('items')
    addItem(@Body() data:AddCartItemDto,
    @Session() session:{
        userId?:number;
        cartId?:number;
    }){
        return this.cartService.addItem(data,session)
    }

    @Patch('items/:itemId')
    updateItem(@Body() data:UpdateCarItemDto,
        @Param('itemId',ParseIntPipe) itemId:number,
        @Session() session:{
            userId?:number;
            cartId?:number;
        }
    ){
        return this.cartService.updateItem(itemId,data,session)
    }

    @Delete('items/:itemId')
    removeItem(@Param('itemId',ParseIntPipe) itemId:number,
        @Session() session:{
            userId?:number;
            cartId?:number;
    }) {
        return this.cartService.removeItem(itemId,session)
    }
}