import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import type { Relation } from 'typeorm';
import type { Category } from './category.entity.js';
import type { Product } from './product.entity.js';

@Entity({ name: 'subcategories' })
export class Subcategory {

  @OneToMany('Product', (product:Product)=> product.subcategory)
  products!: Relation<Product[]>;

  @PrimaryGeneratedColumn({ name: 'id_subcategory' })
  id!: number;

  @Column({
    name: 'code_subcategory',
    type: 'varchar',
    length: 30,
    unique: true,
  })
  code!: string;

  @Column({ type: 'varchar', length: 100 })
  name!: string;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @ManyToOne('Category', (category: Category) => category.subcategories, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'id_category', referencedColumnName: 'id' })
  category!: Relation<Category>;
}