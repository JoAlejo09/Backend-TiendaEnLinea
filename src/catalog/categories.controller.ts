import { Body, Controller, Get, Param, Post, ParseIntPipe, Patch, Delete, UseGuards}from '@nestjs/common';

import { CategoriesService } from './categories.service.js';
import { CreateCategoryDto } from './dto/create-category.dto.js';
import { UpdateCategoryDto } from './dto/update-category.dto.js';
import { AuthGuard } from '../users/auth.guard.js';
import { RolesGuard } from '../users/roles.guard.js';
import { Roles } from '../users/decorators/roles.decorators.js';
import { UserRole } from '../users/entities/user.entity.js';

@Controller('categories')
export class CategoriesController {
    constructor(private readonly categories: CategoriesService){}

    @UseGuards(AuthGuard,RolesGuard)
    @Roles(UserRole.ADMIN)
    @Post()
    create(@Body() data:CreateCategoryDto){
        return this.categories.create(data);
    }

    @Get()
    findAll(){
        return this.categories.findAll();
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number){
        return this.categories.findOne(id);
    }

    @UseGuards(AuthGuard,RolesGuard)
    @Roles(UserRole.ADMIN)
    @Patch(':id')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() data:UpdateCategoryDto
    ){
        return this.categories.update(id, data);
    }
    
    @UseGuards(AuthGuard,RolesGuard)
    @Roles(UserRole.ADMIN)
    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number){
        return this.categories.remove(id);
    }
}