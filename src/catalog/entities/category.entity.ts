import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import type { Relation } from 'typeorm';
import type { Subcategory } from './subcategory.entity.js';

@Entity({ name: 'categories' })
export class Category {
  @OneToMany('Subcategory', (subcategory: Subcategory) => subcategory.category)
  subcategories!: Relation<Subcategory[]>;

  @PrimaryGeneratedColumn({ name: 'id_category' })
  id!: number;

  @Column({
    name: 'code_category',
    type: 'varchar',
    length: 30,
    unique: true,
  })
  code!: string;

  @Column({
    type: 'varchar',
    length: 100,
  })
  name!: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  description!: string | null;
}