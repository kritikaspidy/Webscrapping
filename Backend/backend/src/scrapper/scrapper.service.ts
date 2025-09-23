import { Injectable, Logger } from '@nestjs/common';
import { PlaywrightCrawler, RequestQueue } from 'crawlee';
import { NavigationService } from '../navigation/navigation.service';
import { CategoryService } from '../category/category.service';
import { ProductService } from '../product/product.service';
// import { ReviewService } from '../review/review.service';

type UserData = 
  | { type: 'HOME' }
  | { type: 'HEADING'; headingId: number; headingName: string }
  | { type: 'CATEGORY'; headingId: number; categoryId: number }
  | { type: 'PRODUCT'; headingId: number; categoryId: number };

@Injectable()
export class ScraperService {
  private readonly logger = new Logger(ScraperService.name);

  constructor(
    private readonly navigationService: NavigationService,
    private readonly categoryService: CategoryService,
    private readonly productService: ProductService,
    // private readonly reviewService: ReviewService,
  ) {}

  async run(startUrl: string) {
    const requestQueue = await RequestQueue.open();

    // Start with homepage
    await requestQueue.addRequest({ url: startUrl, userData: { type: 'HOME' } });

    const crawler = new PlaywrightCrawler({
      requestQueue,
      maxConcurrency: 3,
      launchContext: { launchOptions: { headless: true } },
      navigationTimeoutSecs: 120,

      requestHandler: async ({ page, request, log }) => {
        const userData = request.userData as UserData;
        log.info(`Handling ${request.url} (${userData.type})`);

        if (userData.type === 'HOME') {
          try {
            await page.waitForSelector('a.header__menu-item', { timeout: 10000 });
          } catch {
            this.logger.warn('No navigation found on HOME page. Check selector!');
            return;
          }

          const headings = await page.$$eval(
            'a.header__menu-item[data-menu_subcategory=""]',
            nodes => nodes.map(n => ({
              name: (n.textContent || '').trim(),
              href: (n as HTMLAnchorElement).href,
            })),
          );

          if (!headings.length) {
            this.logger.warn('No headings found on HOME page. Check selector!');
          }

          for (const h of headings) {
            if (!h.href || !h.name) continue;

            const nav = 
              (await this.navigationService.findByName?.(h.name)) ??
              (await this.navigationService.create?.({ title: h.name, url: h.href }));

            if (!nav?.id) continue;

            await requestQueue.addRequest({
              url: h.href,
              userData: { type: 'HEADING', headingId: nav.id, headingName: h.name },
            });
          }
        } else if (userData.type === 'HEADING') {
          const { headingId, headingName } = userData;

          const categories = await page.$$eval(
            'a.header__menu-item[data-menu_subcategory]:not([data-menu_subcategory=""])',
            (nodes, headingName) =>
              nodes
                .filter(n => n.getAttribute('data-menu_category') === headingName)
                .map(n => ({
                  name: n.getAttribute('data-menu_subcategory'),
                  href: (n as HTMLAnchorElement).href,
                })),
            headingName,
          );

          for (const c of categories) {
            if (!c.href || !c.name) continue;

            const navEntity = await this.navigationService.findOne(headingId);
            if (!navEntity) {
              this.logger.warn(`Navigation with ID ${headingId} not found, skipping category ${c.name}`);
              continue;
            }

            const existing = 
              (await this.categoryService.findByNameAndHeading?.(c.name, headingId)) ??
              (await this.categoryService.create?.({
                name: c.name,
                navigation: navEntity,
                url: c.href,
              }));

            if (!existing?.id) continue;

            await requestQueue.addRequest({
              url: c.href,
              userData: { type: 'CATEGORY', headingId, categoryId: existing.id },
            });
          }
        } else if (userData.type === 'CATEGORY') {
          const { categoryId, headingId } = userData;

          const productCards = await page.$$eval('div.card.card--standard', cards =>
            cards.map(card => {
              const anchor = card.querySelector('a.product-card');
              const titleEl = card.querySelector('a.product-card');
              const authorEl = card.querySelector('p.author');
              const priceEl = card.querySelector('.price-item');
              const imgEl = card.querySelector('img');

              return {
                title: titleEl?.textContent?.trim() || '',
                href: anchor ? (anchor as HTMLAnchorElement).href : '',
                author: authorEl?.textContent?.trim() || '',
                price: priceEl?.textContent?.trim() || '',
                imageUrl: imgEl ? (imgEl as HTMLImageElement).src : '',
              };
            }),
          );

          const category = await this.categoryService.findOne(categoryId);
          if (!category) {
            this.logger.warn(`Category with ID ${categoryId} not found, skipping products scraping`);
            return;
          }

          for (const p of productCards) {
            if (!p.href) continue;

            await this.productService.create?.({
              title: p.title,
              author: p.author,
              price: parseFloat(p.price.replace(/[^0-9.]/g, '')) || 0,
              imageUrl: p.imageUrl,
              productUrl: p.href,
              category,
            });
          }

          // Pagination handling
          const nextHref = await page.$eval('a.next', (a: HTMLAnchorElement) => a?.href || '').catch(() => '');
          if (nextHref) {
            await requestQueue.addRequest({
              url: nextHref,
              userData: { type: 'CATEGORY', headingId, categoryId },
            });
          }
        } else if (userData.type === 'PRODUCT') {
          const { categoryId } = userData;

          const title = await page.$eval('h1[itemprop="name"]', el => el.textContent?.trim() ?? '').catch(() => '');
          if (!title) {
            this.logger.warn(`Product page missing title, skipping`);
            return;
          }

          const author = await page.$eval('.author', el => el.textContent?.trim() ?? '').catch(() => '');
          const priceText = await page.$eval('.price-item', el => el.textContent?.trim() ?? '').catch(() => '');
          const price = parseFloat(priceText.replace(/[^0-9.]/g, '')) || 0;
          const imageUrl = await page.$eval('.product__images-main img', el => (el as HTMLImageElement).src).catch(() => '');
          const productUrl = page.url();

          const category = await this.categoryService.findOne(categoryId);

          await page.waitForSelector('table.product-details, table.additional-info'); // wait for table containing metadata
          const metadataEntries = await page.$$eval('table.product-details tr, table.additional-info tr', rows => {
            return rows.map(row => {
              const cells = row.querySelectorAll('td');
              return {
                key: cells[0]?.textContent?.trim() ?? '',
                value: cells[1]?.textContent?.trim() ?? '',
              };
            });
          });


          const metadata: Record<string, string> = {};
          for (const entry of metadataEntries) {
            if (entry.key && entry.value) metadata[entry.key] = entry.value;
          }

          await page.waitForSelector('.product-description, .product-accordion-summary', { timeout: 10000 });
          const description = await page.$eval('.product-description, .product-accordion-summary', el => el.textContent?.trim() ?? '');



          // Related products extraction
          const relatedProducts = await page.$$eval(
          '.related-products .product-card, #relatedProducts .product-card',
          cards => cards.map(card => {
            const anchor = card.querySelector('h3 a, a');
            return {
              title: anchor?.textContent?.trim() || '',
              url: (anchor as HTMLAnchorElement)?.href || '',
              author: (card.querySelector('.author')?.textContent ?? '').trim(),
              price: (card.querySelector('.price-item')?.textContent ?? '').trim(),
              imageUrl: (card.querySelector('img')?.src) ?? '',
            };
          }),
        );


          const savedProduct = await this.productService.create({
            title,
            author,
            price,
            imageUrl,
            productUrl,
            category,
            description,
            metadata,
          });

          for (const related of relatedProducts) {
            let relatedProduct = await this.productService.findByUrl(related.url);
            if (!relatedProduct) {
              relatedProduct = await this.productService.create({
                title: related.title,
                author: related.author,
                price: parseFloat(related.price.replace(/[^0-9.]/g, '')) || 0,
                imageUrl: related.imageUrl,
                productUrl: related.url,
              });
            }

            if (!savedProduct.relatedProducts) savedProduct.relatedProducts = [];
            savedProduct.relatedProducts.push(relatedProduct);
          }

          await this.productService.update(savedProduct.id, { relatedProducts: savedProduct.relatedProducts });

          this.logger.log(`Finished scraping product: ${title}`);
        }
      },

      failedRequestHandler: async ({ request, error }) => {
        this.logger.error(`Request ${request.url} failed: ${String(error)}`);
      },
    });

    this.logger.log('Starting crawler run...');
    await crawler.run();
    this.logger.log('Crawler finished');
  }
}
