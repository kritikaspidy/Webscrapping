import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Navigation } from './navigation.entity';
import { Product } from './product.entity';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
url: string;


  @ManyToOne(() => Navigation, navigation => navigation.categories, { onDelete: 'CASCADE' })
  navigation: Navigation;

  @OneToMany(() => Product, product => product.category)
  products: Product[];
}
