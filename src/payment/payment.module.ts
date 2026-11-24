import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Payment } from "./entities/payment.entity.js";
import { UsersModule } from "../users/users.module.js";
import { PaymentService } from "./payment.service.js";
import { AuthGuard } from "../users/auth.guard.js";
import { RolesGuard } from "../users/roles.guard.js";
import { PaymentController } from "./payment.controller.js";
import { InvoiceModule } from "../invoice/invoice.module.js";

@Module({
    imports:[TypeOrmModule.forFeature([Payment]),UsersModule, InvoiceModule],
    providers:[PaymentService, AuthGuard, RolesGuard],
    controllers:[PaymentController],
    exports:[TypeOrmModule, PaymentService]
})
export class PaymentModule{}