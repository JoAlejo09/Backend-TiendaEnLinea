import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { CreateSubcategoryDto } from './dto/create-subcategory.dto.js';
import { UpdateSubcategoryDto } from './dto/update-subcategory.dto.js';
import { SubcategoriesService } from './subcategories.service.js';
import { Roles } from '../users/decorators/roles.decorators.js';
import { AuthGuard } from '../users/auth.guard.js';
import { RolesGuard } from '../users/roles.guard.js';
import { UserRole } from '../users/entities/user.entity.js';
@Controller('subcategories')
export class SubcategoriesController {
    constructor(private readonly subcategories: SubcategoriesService){}
    
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Post()
    create(@Body() data:CreateSubcategoryDto){
        return this.subcategories.create(data);
    }

    @Get()
    findAll(){
        return this.subcategories.findAll();
    }
    
    @Get(':id')
    findOne(@Param('id',ParseIntPipe)id:number){
        return this.subcategories.findOne(id);
    }

    @UseGuards(AuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Patch(':id')
    update(
        @Param('id',ParseIntPipe )id:number,
        @Body() data:UpdateSubcategoryDto
    ){
        return this.subcategories.update(id,data);
    }
    
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Delete(':id')
    remove(@Param('id', ParseIntPipe)id:number){
        return this.subcategories.remove(id);
    }

}