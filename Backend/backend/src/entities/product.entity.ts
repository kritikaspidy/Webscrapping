import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { Category } from './category.entity';
// import { Review } from './review.entity';

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
  description?: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: Record<string, string>;


  @ManyToOne(() => Category, (category) => category.products, { eager: true, onDelete: 'CASCADE' })
  category: Category;

  @ManyToMany(() => Product)
  @JoinTable({
  name: 'product_related_products',
  joinColumn: { name: 'product_id' },
  inverseJoinColumn: { name: 'related_product_id' },
})
relatedProducts: Product[];


// @OneToMany(() => Review, review => review.product, { cascade: true })
// reviews: Review[];
}
