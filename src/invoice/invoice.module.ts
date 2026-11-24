import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Invoice } from "./entities/invoice.entity.js";
import { InvoiceService } from "./invoice.service.js";
import { InvoiceController } from "./invoice.controller.js";
import { UsersModule } from "../users/users.module.js";
import { AuthGuard } from "../users/auth.guard.js";

@Module({
    imports:[TypeOrmModule.forFeature([Invoice]), UsersModule],
    providers:[InvoiceService,AuthGuard],
    controllers:[InvoiceController],
    exports:[TypeOrmModule, InvoiceService]
})
export class InvoiceModule{}