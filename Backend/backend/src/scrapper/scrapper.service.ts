import { Injectable, Logger } from '@nestjs/common';
import { PlaywrightCrawler, RequestQueue } from 'crawlee';
import { NavigationService } from '../navigation/navigation.service';
import { CategoryService } from '../category/category.service';
import { ProductService } from '../product/product.service';
import { Navigation } from 'src/entities/navigation.entity';


type UserData =
  | { type: 'HOME' }
  | { type: 'HEADING'; headingId: number, headingName: string }
  | { type: 'CATEGORY'; headingId: number; categoryId: number }
  | { type: 'PRODUCT'; headingId: number; categoryId: number };


@Injectable()
export class ScraperService {
  private readonly logger = new Logger(ScraperService.name);


  constructor(
    private readonly navigationService: NavigationService,
    private readonly categoryService: CategoryService,
    private readonly productService: ProductService,
  ) {}
  


  /**
   * Entry point: call run('https://www.worldofbooks.com')
   */
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


        // ---------- HOME ----------
        if (userData.type === 'HOME') {
          try {
            await page.waitForSelector('a.header__menu-item', { timeout: 10000 });
          } catch {
            this.logger.warn('No navigation found on HOME page. Check selector!');
            return;
          }


          const headings = await page.$$eval('a.header__menu-item[data-menu_subcategory=""]', nodes =>
            nodes.map(n => ({
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


            const headingId = nav?.id;
            if (!headingId) continue;


            await requestQueue.addRequest({
              url: h.href,
              userData: { type: 'HEADING', headingId, headingName: h.name },
            });
          }
        }


        // ---------- HEADING ----------
        else if (userData.type === 'HEADING') {
          const { headingId, headingName } = userData;


          const categories = await page.$$eval(
          'a.header__menu-item[data-menu_subcategory]:not([data-menu_subcategory=""])',
          (nodes, headingName) => nodes
            .filter(n => n.getAttribute('data-menu_category') === headingName)
            .map(n => ({
              name: n.getAttribute('data-menu_subcategory'),
              href: (n as HTMLAnchorElement).href,
            })),
            headingName
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


            const categoryId = existing?.id;
            if (!categoryId) continue;


            await requestQueue.addRequest({
              url: c.href,
              userData: { type: 'CATEGORY', headingId, categoryId },
            });
          }
        }


        // ---------- CATEGORY ----------
        else if (userData.type === 'CATEGORY') {
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



for (const p of productCards) {
  if (!p.href) continue;
  const category = await this.categoryService.findOne(categoryId);
  await this.productService.create?.({
    title: p.title,
    author: p.author,
    price: parseFloat(p.price.replace(/[^0-9.]/g, '')) || 0,
    imageUrl: p.imageUrl,
    productUrl: p.href,
    category,
  });
}



          // Pagination
         const nextHref = await page.$eval('a.next', (a: HTMLAnchorElement) => a?.href || '').catch(() => '');
if (nextHref) {
  await requestQueue.addRequest({
    url: nextHref,
    userData: { type: 'CATEGORY', headingId, categoryId },
  });
}


        }


        // ---------- PRODUCT ----------
        else if (userData.type === 'PRODUCT') {
          const { categoryId } = userData;


          const title =
  (await page.$eval('h1[itemprop="name"]', n => (n.textContent || '').trim()).catch(() => '')) || '';



          const author =
            (await page
              .$eval('.product-author', n => (n.textContent || '').trim())
              .catch(() => '')) || '';


          const priceText = await page
            .$eval('.product-price', n => n.textContent?.trim() ?? '')
            .catch(() => '');
          const price = parseFloat(priceText.replace(/[^0-9.]/g, '')) || 0;


          const imageUrl =
            (await page
              .$eval('.product-image img', n => (n as HTMLImageElement).src)
              .catch(() => '')) || '';


          const productUrl = page.url();


          if (!title) {
            this.logger.warn(`Product page ${productUrl} missing title — skipping save.`);
          } else {
            const category = await this.categoryService.findOne(categoryId);
            await this.productService.upsertProduct({
              title,
              author,
              price,
              imageUrl,
              productUrl,
              category,
            });
            this.logger.log(`Saved product: ${title}`);
          }
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