import { Body, Controller, Post, UseGuards, Session, Get, Param, ParseIntPipe } from "@nestjs/common";
import { AuthGuard } from "../users/auth.guard.js";
import { RolesGuard } from "../users/roles.guard.js";
import { Roles } from "../users/decorators/roles.decorators.js";
import { UserRole } from "../users/entities/user.entity.js";
import { CreateOrderDto } from "./dto/create-order.dto.js";
import { OrderService } from "./orders.service.js";

type OrderSession={
    userId?:number,
    cartId?:number
}


@Controller('order')
export class OrderController{

    constructor(private readonly order:OrderService){}

    @Post()
    @UseGuards(AuthGuard,RolesGuard)
    @Roles(UserRole.CLIENT)
    createNewOrder(@Body() data:CreateOrderDto, @Session() session:OrderSession)
    {
        return this.order.createOrder(data, session)
    }

    @Get('me')
    @UseGuards(AuthGuard)
    @Roles(UserRole.CLIENT)
    findOrderByUser(@Session() session:{userId:number}){
        return this.order.findOrdersByUser(session.userId)
    }
    
    @Get('me/:orderId')
    @UseGuards(AuthGuard)
    @Roles(UserRole.CLIENT)
    findOrderDetailByUser(@Param('orderId', ParseIntPipe) orderId:number, 
    @Session() session:{userId:number}){
        return this.order.findOrderDetailByUser(orderId,session.userId)
    }

    @Get('')
    @UseGuards(AuthGuard)
    @Roles(UserRole.ADMIN)
    findAllOrders(){
        return this.order.findAllOrders()
    }
}