import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { ProductService } from './product.service';
import { Product } from '../entities/product.entity';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async getAllProducts(): Promise<Product[]> {
    return this.productService.findAll();
  }

  @Get(':id')
  async getProductById(@Param('id') id: number): Promise<Product> {
    return this.productService.findOne(id);
  }

  @Get('category/:categoryId')
async getProductsByCategory(@Param('categoryId') categoryId: number): Promise<Product[]> {
  return this.productService.findByCategory(categoryId);
}


  @Post()
  async createProduct(@Body() productData: Partial<Product>): Promise<Product> {
    return this.productService.create(productData);
  }

  @Put(':id')
  async updateProduct(@Param('id') id: number, @Body() updateData: Partial<Product>): Promise<Product> {
    return this.productService.update(id, updateData);
  }

  @Delete(':id')
  async deleteProduct(@Param('id') id: number): Promise<void> {
    return this.productService.delete(id);
  }
}
