import { Body, Controller, Get, Post } from '@nestjs/common';
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

  @Post('start-product-scrape')
  async scrapeProductDetails(@Body() body: { url: string }) {
    const url = body.url || 'https://www.worldofbooks.com';  // default to homepage if none provided
    await this.scraperService.run(url);
    return { message: `Started scraping products from ${url}` };
  }
}
