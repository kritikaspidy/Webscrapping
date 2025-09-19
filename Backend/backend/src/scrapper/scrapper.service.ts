import { Injectable, Logger } from '@nestjs/common';
import { PlaywrightCrawler } from 'crawlee';
import { NavigationService } from '../navigation/navigation.service';
import { CategoryService } from '../category/category.service';
import { ProductService } from '../product/product.service';


@Injectable()
export class ScraperService {
  private readonly logger = new Logger(ScraperService.name);

  constructor(
    private readonly navigationService: NavigationService,
    private readonly categoryService: CategoryService,
    private readonly productService: ProductService,
  ) {}

  async scrapeNavigationHeadings() {
    const results: { title: string; url: string }[] = [];

    const crawler = new PlaywrightCrawler({
      async requestHandler({ page, request, log }) {
        const headings = await page.$$eval('nav a', (elements) =>
          elements.map((el) => ({
            title: el.textContent.trim(),
            url: (el as HTMLAnchorElement).href,
          })),
        );
        results.push(...headings);
        log.info(`Scraped ${headings.length} navigation headings from ${request.url}`);
      },
      maxRequestsPerCrawl: 1,
      maxConcurrency: 1,
    });

    await crawler.run(['https://www.worldofbooks.com']);
    this.logger.log(`Scraped total ${results.length} navigation headings`);

    for (const nav of results) {
      await this.navigationService.create(nav);
    }

    return results;
  }

  async scrapeCategories(navigationId: number) {
    const results: { title: string; url: string }[] = [];

    const navigation = await this.navigationService.findOne(navigationId);

    const crawler = new PlaywrightCrawler({
      async requestHandler({ page, log }) {
        const categories = await page.$$eval('.category-link-selector', (elements) =>
          elements.map((el) => ({
            title: el.textContent.trim(),
            url: (el as HTMLAnchorElement).href,
          })),
        );
        results.push(...categories);
        log.info(`Scraped ${categories.length} categories`);
      },
      maxRequestsPerCrawl: 1,
      maxConcurrency: 1,
    });

    // Adjust the URL to the actual navigation page URL with navigationId if necessary
    await crawler.run([`https://www.worldofbooks.com/navigation/${navigationId}`]);

    for (const category of results) {
      await this.categoryService.create({
        name: category.title,
        navigation,
      });
    }

    return results;
  }

  async scrapeProducts(categoryId: number) {
    const results: { title: string; price: string; url: string }[] = [];

    const crawler = new PlaywrightCrawler({
      async requestHandler({ page, log }) {
        const products = await page.$$eval('.product-grid-item', (items) =>
          items.map((item) => {
            const title = item.querySelector('.product-title')?.textContent?.trim() ?? '';
            const price = item.querySelector('.product-price')?.textContent?.trim() ?? '';
            const url = (item.querySelector('a') as HTMLAnchorElement)?.href;
            return { title, price, url };
          }),
        );
        results.push(...products);
        log.info(`Scraped ${products.length} products`);
      },
      maxRequestsPerCrawl: 1,
      maxConcurrency: 1,
    });

    await crawler.run([`https://www.worldofbooks.com/category/${categoryId}`]);

    const category = await this.categoryService.findOne(categoryId);

    for (const product of results) {

        const price = parseFloat(product.price.replace(/[^0-9.-]+/g, '')) || 0;

      await this.productService.create({
        title: product.title,
        author: "",
        price,
        imageUrl: "",
        productUrl: product.url,
        category,
      });
    }

    return results;
  }
}
