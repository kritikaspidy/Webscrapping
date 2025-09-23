import { Controller, Get, Post, Put, Delete, Param, Body, Query } from '@nestjs/common';
import { ProductService } from './product.service';
import { Product } from '../entities/product.entity';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async getProducts(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
    @Query('heading') heading?: string,
    @Query('category') category?: string,
    @Query('searchQuery') searchQuery?: string,
  ): Promise<{ products: Product[]; total: number }> {
    return this.productService.filterProducts(
      page,
      limit,
      heading,
      category,
      searchQuery,
    );
  }

  @Get('category/:categoryId')
  async getProductsByCategory(@Param('categoryId') categoryId: number): Promise<Product[]> {
    return this.productService.findByCategory(categoryId);
  }

  @Get(':id')
  async getProductById(@Param('id') id: number): Promise<Product> {
    return this.productService.findOne(id);
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