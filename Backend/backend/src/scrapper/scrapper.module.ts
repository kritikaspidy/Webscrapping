import { forwardRef, Module } from '@nestjs/common';
import { ScraperService } from './scrapper.service';
import { ScrapperController } from './scrapper.controller';
import { NavigationModule } from 'src/navigation/navigation.module';
import { CategoryModule } from 'src/category/category.module';
import { ProductModule } from 'src/product/product.module';
// import { ReviewModule } from 'src/review/review.module';

@Module({
  imports: [forwardRef(() => NavigationModule), CategoryModule, ProductModule], // import NavigationModule or provide NavigationService
  providers: [ScraperService],
  controllers: [ScrapperController],
  exports: [ScraperService],
})
export class ScraperModule {}