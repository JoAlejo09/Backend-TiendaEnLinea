import { Controller, Param, ParseIntPipe, Post, Session, UseGuards } from "@nestjs/common";
import { PaymentService } from "./payment.service.js";
import { AuthGuard } from "../users/auth.guard.js";
import { RolesGuard } from "../users/roles.guard.js";
import { Roles } from "../users/decorators/roles.decorators.js";
import { UserRole } from "../users/entities/user.entity.js";

@Controller('payments')
export class PaymentController{
    constructor(private readonly payments:PaymentService){}

    @Post('orders/:orderId/simulate')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(UserRole.CLIENT)
    paymentProcessed(@Param('orderId',ParseIntPipe) orderId:number, 
        @Session() session:{userId:number}){
        return this.payments.processPayment (orderId, session)
    }
}