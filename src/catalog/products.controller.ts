import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';
import { ProductsServices } from './product.service.js';
import { AuthGuard } from '../users/auth.guard.js';
import { RolesGuard } from '../users/roles.guard.js';
import { Roles } from '../users/decorators/roles.decorators.js';
import { UserRole } from '../users/entities/user.entity.js';

@Controller('products')
export class ProductsController{
    constructor(private readonly products: ProductsServices){}
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Post()
    create(@Body() data:CreateProductDto){
        return this.products.create(data);
    }

    @Get()
    findAll(){
        return this.products.findAll()
    }

    @Get(':id')
    findOne(@Param('id',ParseIntPipe) id:number){
        return this.products.findOne(id)
    }
    
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Patch(':id')
    update(
        @Param('id',ParseIntPipe) id:number,
        @Body() data:UpdateProductDto
    ){
        return this.products.update(id, data)
    }
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Delete(':id')
    remove(@Param('id',ParseIntPipe)id:number){
        return this.products.remove(id)
    }
}