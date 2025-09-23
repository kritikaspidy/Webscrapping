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

  @Column({ type: 'text', nullable: true })
  description: string;

   @Column('json', { nullable: true })
  reviews: { text: string; author: string }[];

  @Column({ type: 'text', nullable: true })
  aboutAuthor: string;

  @Column({ type: 'jsonb', nullable: true })
  additionalInfo: Record<string, string>;

  @ManyToOne(() => Category, (category) => category.products, { eager: true, onDelete: 'CASCADE' })
  category: Category;
}