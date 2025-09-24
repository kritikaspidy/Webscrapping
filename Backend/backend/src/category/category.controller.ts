import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CategoryService } from './category.service';
import { Category } from 'src/entities/category.entity';

@Controller('category')
export class CategoryController {
  constructor(private categoryservice: CategoryService) {}

  @Get()
  async getAll(): Promise<Category[]> {
    return this.categoryservice.findAll();
  }

  @Get(':id')
  async getone(@Param('id') id: number): Promise<Category> {
    return this.categoryservice.findOne(id);
  }

  @Get('navigation/:navigationid')
  async getcategoriesbynavigation(
    @Param('navigationid') navigationid: number,
  ): Promise<Category[]> {
    return this.categoryservice.findByNavigation(navigationid);
  }

  @Post()
  async createCategory(@Body() categoryData: Partial<Category>): Promise<Category> {
    // If navigation relation comes as ID, map it to nested object for TypeORM relation
    if (
      categoryData.navigation &&
      typeof categoryData.navigation === 'number'
    ) {
      categoryData.navigation = { id: categoryData.navigation } as any;
    }

    return this.categoryservice.create(categoryData);
  }

  @Put(':id')
  async updateCategory(
    @Param('id') id: number,
    @Body() updateData: Partial<Category>,
  ): Promise<Category> {
    // Handle navigation relation update similarly
    if (
      updateData.navigation &&
      typeof updateData.navigation === 'number'
    ) {
      updateData.navigation = { id: updateData.navigation } as any;
    }
    return this.categoryservice.update(id, updateData);
  }

  @Delete(':id')
  async deleteCategory(@Param('id') id: number): Promise<void> {
    return this.categoryservice.delete(id);
  }
}