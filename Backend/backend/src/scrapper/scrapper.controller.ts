import { Controller, Post } from '@nestjs/common';
import { ScraperService } from './scrapper.service';

@Controller('scrape')
export class ScrapperController {
  constructor(private readonly scraperService: ScraperService) {}

  @Post('start')
  startScraping() {
    // We don't use `await` here, so the request returns immediately
    // while the scraping runs in the background.
    this.scraperService.run('https://www.worldofbooks.com');
    return { message: 'Scraping process has been initiated in the background.' };
  }
}
