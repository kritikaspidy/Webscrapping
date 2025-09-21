import { Controller, Get } from '@nestjs/common';
import { ScraperService } from '../scrapper/scrapper.service'; // Adjust path

@Controller('scrape')
export class ScrapperController {
  constructor(private readonly scraperService: ScraperService) {}

  @Get('navigation')
  async scrapeNavigationHeadings() {
    return this.scraperService.run('https://www.worldofbooks.com'); // homepage
  }

  @Get('categories')
  async scrapeCategories() {
    return this.scraperService.run('https://www.worldofbooks.com'); // categories
  }

  @Get('products')
  async scrapeProducts() {
    return this.scraperService.run('https://www.worldofbooks.com'); // products
  }
}
