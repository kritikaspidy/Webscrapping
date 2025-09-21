import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { NavigationService } from './navigation.service';
import { Navigation } from '../entities/navigation.entity';
import { ScraperService } from '../scrapper/scrapper.service';

@Controller('navigation')
export class NavigationController {
  constructor(
    private navService: NavigationService,
    private scraperService: ScraperService,
  ) {}

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

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateData: Partial<Navigation>,
  ): Promise<Navigation> {
    const navigation = await this.navService.findOne(id);
    Object.assign(navigation, updateData);
    return this.navService.create(navigation);
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    return this.navService.delete(id);
  }

  @Get('scrape/navigation')
async scrapeNavigation() {
  return this.scraperService.run('https://www.worldofbooks.com');

}

}
