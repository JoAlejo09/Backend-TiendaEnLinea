import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity.js';
import { CreateCategoryDto } from './dto/create-category.dto.js';
import { UpdateCategoryDto } from './dto/update-category.dto.js';

@Injectable()
export class CategoriesService {
    constructor(
        @InjectRepository(Category)
        private readonly categories: Repository<Category>
    ){}

    async create(data: CreateCategoryDto): Promise<Category>{
        const existing = await this.categories.findOneBy({code:data.code});
        if(existing){
            throw new ConflictException('El codigo de categoria ya existe');
        }
        return this.categories.save(this.categories.create(data));
    }

    findAll(): Promise<Category[]>{
        return this.categories.find({order: {name:'ASC'}});
    }

    async findOne(id: number): Promise<Category>{
        const category = await this.categories.findOneBy({id});
        if(!category){
            throw new NotFoundException('Categoria no encontrada');
        }
        return category;
    }

    async update(id: number, data: UpdateCategoryDto): Promise<Category>{
        const category = await this.findOne(id);

        if(data.code && data.code !== category.code){
            const existing = await this.categories.findOneBy({code:data.code});

        if(existing){
            throw new ConflictException('El codigo de categoria ya existe');
        }
    }
    Object.assign(category, data);
    return this.categories.save(category);
    }
    
    async remove(id:number):Promise<void>{
        const category = await this.findOne(id);
        await this.categories.remove(category);
    }

}
