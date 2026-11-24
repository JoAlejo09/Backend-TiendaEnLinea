import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Subcategory } from './entities/subcategory.entity.js';
import { Product } from './entities/product.entity.js';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProductDto } from './dto/create-product.dto.js';
import { UpdateProductDto} from './dto/update-product.dto.js';

@Injectable()
export class ProductsServices{
    constructor(
        @InjectRepository(Product)
        private readonly products: Repository<Product>,
        @InjectRepository(Subcategory)
        private readonly subcategories: Repository<Subcategory>
    ){}

    async create (data:CreateProductDto): Promise<Product>{
        const subcategory = await this.subcategories.findOneBy({id: data.subcategoryId});
        if(!subcategory){
            throw new NotFoundException('La subcategoria no se ha encontrado')
        }

        const existing = await this.products.findOneBy({code: data.code});
        if(existing){
            throw new ConflictException('El codigo del producto ya existe')
        }

        const {subcategoryId, price, ...fields} = data;
        const product = this.products.create({
            ...fields,
            price: price.toFixed(2),
            stock:0,
            subcategory
        });

        return this.products.save(product);
    }
    findAll():Promise<Product[]>{
        return this.products.find({
            where: {isActive:true},
            relations:{
                subcategory:{
                    category:true,
                },
            },
            order:{
                name:'ASC',
            }
        });
    }
    async findOne(id:number):Promise<Product>{
        const product = await this.products.findOne({
            where:{id},
            relations:{
                subcategory:{
                    category:true,
                },
            },
        });
        if(!product){
            throw new NotFoundException('Producto no encontrado')
        }
        return product;
    }
    async update(id: number, data: UpdateProductDto): Promise<Product> {
        const product = await this.findOne(id);
        const { subcategoryId, price, ...fields } = data;
        
        if (fields.code && fields.code !== product.code) {
            const existing = await this.products.findOneBy({
                code: fields.code,
            });

            if (existing) {
                throw new ConflictException('El código del producto ya existe.');
            }
        }
    
        if (subcategoryId !== undefined) {
            const subcategory = await this.subcategories.findOneBy({
                id: subcategoryId,
            });
            if (!subcategory) {
                throw new NotFoundException('Subcategoría no encontrada.');
            }
            product.subcategory = subcategory;
        }
        Object.assign(product, fields);
        if (price !== undefined) {
            product.price = price.toFixed(2);
        }
        return this.products.save(product);
    }

    async remove(id:number):Promise<Product>{
        const product = await this.findOne(id);
        product.isActive = false;
        return this.products.save(product);
    }
}