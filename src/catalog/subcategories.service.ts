import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity.js';
import { Subcategory } from './entities/subcategory.entity.js';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateSubcategoryDto } from './dto/create-subcategory.dto.js';
import { UpdateSubcategoryDto } from './dto/update-subcategory.dto.js';

@Injectable()
export class SubcategoriesService{
    constructor(
        @InjectRepository(Subcategory)
        private readonly subcategories: Repository<Subcategory>
        ,

        @InjectRepository(Category)
        private readonly categories: Repository<Category>
    ){}

    async create(data:CreateSubcategoryDto):Promise<Subcategory>{
        const category = await this.categories.findOneBy({id: data.categoryId});
        if(!category){
            throw new NotFoundException('Categoria no encontrada');
        }

        const existing = await this.subcategories.findOneBy({code: data.code});
        if(existing){
            throw new ConflictException('El codigo de subcategoria ya existe');
        }

        const { categoryId,...fields} = data;
        const subcategory = this.subcategories.create({...fields, category});
    
        return this.subcategories.save(subcategory);   
    }
    
    findAll(): Promise<Subcategory[]>{
        return this.subcategories.find({
            relations:{category:true},
            order:{name:'ASC'}
        });
    }

    async findOne(id:number): Promise<Subcategory>{
        const subcategory = await this.subcategories.findOne({
            where: {id},
            relations:{category:true}
        })

        if(!subcategory){
            throw new NotFoundException('Subcategoria no encontrada');
        }

        return subcategory;
    }

    async update(
        id: number,
        data: UpdateSubcategoryDto
    ): Promise<Subcategory>{
        const subcategory = await this.findOne(id);
        const { categoryId, ...fields} = data;

        if(fields.code && fields.code !== subcategory.code){
            const existing = await this.subcategories.findOneBy({
                code: fields.code,
            })
            if(existing){
                throw new ConflictException('El codigo de subcategoria ya existe')
            }
        }
        if(categoryId !== undefined){
            const category = await this.categories.findOneBy({ id:categoryId});

            if(!category){
                throw new NotFoundException('Categoria no encontrada')
            }
            subcategory.category = category;
        }
        Object.assign(subcategory,fields);
        return this.subcategories.save(subcategory);
    }

    async remove(id:number): Promise<void>{
        const subcategory = await this.findOne(id);
        await this.subcategories.remove(subcategory);
    }
}