import { Controller , Get} from '@nestjs/common';
import { ScraperService } from './scrapper.service';

@Controller('scrapper')
export class ScrapperController {
    constructor(private readonly Scrapperservice: ScraperService) {}
    
    @Get('navigation')
    async ScrapeNavigation() {
        return this.Scrapperservice.scrapeNavigationHeadings();
    }
}
