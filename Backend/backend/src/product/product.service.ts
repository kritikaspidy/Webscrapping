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
    return this.productRepository.find();
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
      relations: ['category'],
    });
  }

  async create(productData: Partial<Product>): Promise<Product> {
    if (productData.category) {
      const categoryId = (productData.category as any).id ?? productData.category;
      const category = await this.categoryRepository.findOneBy({ id: categoryId });
      if (!category) {
        throw new NotFoundException(`Category with ID ${categoryId} not found`);
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
    if (updateData.category) {
      const categoryId = (updateData.category as any).id ?? updateData.category;
      const category = await this.categoryRepository.findOneBy({ id: categoryId });
      if (!category) {
        throw new NotFoundException(`Category with ID ${categoryId} not found`);
      }
      updateData.category = category;
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

  async findByUrl(productUrl: string): Promise<Product | null> {
    return this.productRepository.findOne({ where: { productUrl } });
  }

  async filterProducts(
    page = 1,
    limit = 20,
    heading?: string,
    category?: string,
    searchQuery?: string
  ): Promise<{ products: Product[]; total: number }> {
    const skip = (page - 1) * limit;

    const queryBuilder = this.productRepository.createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('category.navigation', 'navigation');

    if (category) {
      queryBuilder.andWhere('category.name ILIKE :category', { category: `%${category}%` });
    }

    if (heading) {
      queryBuilder.andWhere('navigation.title ILIKE :heading', { heading: `%${heading}%` });
    }
    
    if (searchQuery) {
      queryBuilder.andWhere(
        '(product.title ILIKE :searchQuery OR product.author ILIKE :searchQuery)',
        { searchQuery: `%${searchQuery}%` }
      );
    }
    
    const [products, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .getManyAndCount();
    
    return { products, total };
  }

  async upsertProduct(productData: Partial<Product>): Promise<Product> {
    let product = await this.productRepository.findOne({ where: { productUrl: productData.productUrl } });
    if (product) {
      // update only existing fields (no description/review/related handling anymore)
      if (productData.title) product.title = productData.title;
      if (productData.author) product.author = productData.author;
      if (productData.price) product.price = productData.price;
      if (productData.imageUrl) product.imageUrl = productData.imageUrl;
      if (productData.category) product.category = productData.category;
    } else {
      product = this.productRepository.create(productData);
    }
    return this.productRepository.save(product);
  }
}
