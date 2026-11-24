import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity.js';
import { Subcategory } from './entities/subcategory.entity.js';
import {CategoriesController} from './categories.controller.js';
import { CategoriesService } from './categories.service.js';
import { SubcategoriesController } from './subcategories.controller.js';
import { SubcategoriesService } from './subcategories.service.js';
import { Product } from './entities/product.entity.js';
import { UsersModule } from '../users/users.module.js';
import { ProductsController } from './products.controller.js';
import { ProductsServices } from './product.service.js';

@Module({
    imports: [TypeOrmModule.forFeature([Category, Subcategory, Product]), UsersModule],
    controllers: [CategoriesController, SubcategoriesController, ProductsController],
    providers: [CategoriesService, SubcategoriesService, ProductsServices],
})
export class CatalogModule {}
