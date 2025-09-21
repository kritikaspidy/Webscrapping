import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Category } from './category.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  author: string;

  @Column('decimal')
  price: number;

  @Column()
  imageUrl: string;

  @Column()
  productUrl: string;

  @ManyToOne(() => Category, (category) => category.products, { eager: true, onDelete: 'CASCADE' })
  category: Category;
}
