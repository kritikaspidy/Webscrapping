import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseInterceptors, ValidationPipe } from '@nestjs/common';
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';
import { ProductService } from './product.service';
import { Product } from '../entities/product.entity';
import { CreateProductDto } from '../product.dto';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(30 * 1000) // Cache for 30 seconds
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
  @UseInterceptors(CacheInterceptor)
  @CacheKey('products_by_category_:categoryId')
  @CacheTTL(60 * 1000)
  async getProductsByCategory(@Param('categoryId') categoryId: number): Promise<Product[]> {
    return this.productService.findByCategory(categoryId);
  }

  @Get(':id')
  @UseInterceptors(CacheInterceptor)
  @CacheKey('product_:id')
  @CacheTTL(5 * 60 * 1000) // Cache for 5 minutes
  async getProductById(@Param('id') id: number): Promise<Product> {
    return this.productService.findOne(id);
  }

  @Post()
  async createProduct(@Body(new ValidationPipe()) createProductDto: CreateProductDto): Promise<Product> {
    return this.productService.create(createProductDto);
  }

  @Put(':id')
  async updateProduct(@Param('id') id: number, @Body(new ValidationPipe()) updateData: Partial<CreateProductDto>): Promise<Product> {
    return this.productService.update(id, updateData);
  }

  @Delete(':id')
  async deleteProduct(@Param('id') id: number): Promise<void> {
    return this.productService.delete(id);
  }
}

