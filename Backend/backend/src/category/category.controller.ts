import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CategoryService } from './category.service';
import { Category } from 'src/entities/category.entity';

@Controller('category')
export class CategoryController {
    constructor (private categoryservice: CategoryService) {}


    @Get()
    async getAll(): Promise<Category[]> {
        return this.categoryservice.findAll();
    }

    @Get(':id')
    async getone(@Param('id') id: number): Promise<Category>{
        return this.categoryservice.findOne(id);
    }

    @Get('navigation/:navigationid')
    async getcategoriesbynavigation(@Param('navigationid') navigationid: number): Promise<Category[]> {
        return this.categoryservice.findByNavigation(navigationid);
    }

    @Post()
  async createCategory(@Body() categoryData: Partial<Category>): Promise<Category> {
    return this.categoryservice.create(categoryData);
  }

  @Put(':id')
  async updateCategory(@Param('id') id: number, @Body() updateData: Partial<Category>): Promise<Category> {
    return this.categoryservice.update(id, updateData);
  }

  @Delete(':id')
  async deleteCategory(@Param('id') id: number): Promise<void> {
    return this.categoryservice.delete(id);
  }
}
