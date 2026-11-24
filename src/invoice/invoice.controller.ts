import { Controller, Get, Param, ParseIntPipe, Session, UseGuards } from "@nestjs/common";
import { InvoiceService } from "./invoice.service.js";
import { AuthGuard } from "../users/auth.guard.js";

@Controller('invoices')
export class InvoiceController{
    constructor(private readonly invoice:InvoiceService){}

    @Get('orders/:orderId')
    @UseGuards(AuthGuard)
    getInvoicesByOrderForUser(@Param('orderId',ParseIntPipe) orderId:number, @Session() session:{userId:number}){
        return this.invoice.findInvoiceByOrderForUser(orderId, session.userId)
    }
}