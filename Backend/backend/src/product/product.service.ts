import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { Category } from '../entities/category.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async findAll(): Promise<Product[]> {
    return this.productRepository.find({ relations: ['category'] });
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['category'],
    });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  async findByCategory(categoryId: number): Promise<Product[]> {
  return this.productRepository.find({
    where: { category: { id: categoryId } },
    relations: ['category'], // if needed
  });
}


  async create(productData: Partial<Product>): Promise<Product> {
    if (productData.category) {
      const category = await this.categoryRepository.findOneBy({
        id: (productData.category as Category).id,
      });
      if (!category) {
        throw new NotFoundException(
          `Category with ID ${(productData.category as Category).id} not found`
        );
      }
      productData.category = category;
    }
    const product = this.productRepository.create(productData);
    return this.productRepository.save(product);
  }

  async update(id: number, updateData: Partial<Product>): Promise<Product> {
    const product = await this.productRepository.findOneBy({ id });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    Object.assign(product, updateData);
    return this.productRepository.save(product);
  }

  async delete(id: number): Promise<void> {
    const result = await this.productRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
  }
}
