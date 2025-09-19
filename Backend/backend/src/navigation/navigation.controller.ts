import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { NavigationService } from './navigation.service';
import { Navigation } from '../entities/navigation.entity';

@Controller('navigation')
export class NavigationController {
  constructor(private navService: NavigationService) {}

  @Get()
  async getAll(): Promise<Navigation[]> {
    return this.navService.findAll();
  }

  @Get(':id')
  async getOne(@Param('id') id: number): Promise<Navigation | null> {
    return this.navService.findOne(id);
  }

  @Post()
  async create(@Body() navData: Partial<Navigation>): Promise<Navigation> {
    return this.navService.create(navData);
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    return this.navService.delete(id);
  }
}
