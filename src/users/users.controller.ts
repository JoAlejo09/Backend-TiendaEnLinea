import { Body, Controller, Post } from "@nestjs/common";
import { UsersService } from "./users.service.js";
import { RegisterCustomerDto } from "./dto/register-customer.dto.js";

@Controller('users')
export class UsersController{
    constructor(private readonly users:UsersService){}

    @Post('register')
    create(@Body() data:RegisterCustomerDto){
        return this.users.registerCustomer(data)
    }
}