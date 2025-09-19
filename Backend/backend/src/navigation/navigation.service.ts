import { Injectable } from '@nestjs/common';
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
    return this.navRepository.find();
  }

  async create(navData: Partial<Navigation>): Promise<Navigation> {
    const navigation = this.navRepository.create(navData);
    return this.navRepository.save(navigation);
  }

  async findOne(id: number): Promise<Navigation> {
    const nav = await this.navRepository.findOneBy({ id });
  if (!nav) {
    throw new Error(`Navigation with id ${id} not found`);
  }
  return nav;
  }

  async delete(id: number): Promise<void> {
    await this.navRepository.delete(id);
  }
}
