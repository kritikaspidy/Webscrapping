import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from 'src/entities/category.entity';

@Injectable()
export class CategoryService {
    constructor(
        @InjectRepository(Category)
        private catrepo: Repository<Category>,
    ) {}

    async findAll(): Promise<Category[]> {
        return this.catrepo.find();
    }

    async findOne(id: number): Promise<Category> {
    const category = await this.catrepo.findOne({
      where: { id },
      relations: ['navigation'],
    });
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return category;
  }

  async create(catdata: Partial<Category>): Promise<Category> {
  console.log('Creating category with:', catdata);
  const category = this.catrepo.create(catdata);
  const saved = await this.catrepo.save(category);
  // console.log('Saved category:', saved);
  return saved;
}




  async findByNavigation(navigationId: number): Promise<Category[]> {
  return this.catrepo.find({
    where: { navigation: { id: navigationId } },
    relations: ['navigation'],
  });
}



    async delete(id: number): Promise<void>{
        await this.catrepo.delete(id);
    }

    async update(id: number, updateData: Partial<Category>): Promise<Category> {
    const category = await this.catrepo.findOneBy({ id });
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    Object.assign(category, updateData);
    return this.catrepo.save(category);
  }
}
