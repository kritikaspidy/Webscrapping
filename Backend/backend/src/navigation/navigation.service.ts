import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Navigation } from '../entities/navigation.entity';

@Injectable()
export class NavigationService {
  constructor(
    @InjectRepository(Navigation)
    private navRepository: Repository<Navigation>,
  ) {}

  async findAll(): Promise<Navigation[]> {
  const allNavigation = await this.navRepository.find();
  console.log(allNavigation); // Add this line for debugging!
  return allNavigation;
}

async findByName(name: string) {
  return this.navRepository.findOne({ where: { title: name } });
}


  async create(navData: Partial<Navigation>): Promise<Navigation> {
    const navigation = this.navRepository.create(navData);
    return this.navRepository.save(navigation);
  }

  async findOne(id: number): Promise<Navigation> {
    const nav = await this.navRepository.findOne({
      where: { id },
      relations: ['categories'],
    });
    if (!nav) {
      throw new NotFoundException(`Navigation with id ${id} not found`);
    }
    return nav;
  }

  async delete(id: number): Promise<void> {
    await this.navRepository.delete(id);
  }
}