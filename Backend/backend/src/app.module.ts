import { Module } from '@nestjs/common';
import { TypeOrmModule} from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Category } from './entities/category.entity';
import { Product } from './entities/product.entity';
import { Navigation } from './entities/navigation.entity';
import { NavigationService } from './navigation/navigation.service';
import { NavigationController } from './navigation/navigation.controller';
import { CategoryService } from './category/category.service';
import { CategoryController } from './category/category.controller';
import { ProductService } from './product/product.service';
import { ProductController } from './product/product.controller';
import { ScraperModule } from './scrapper/scrapper.module';
import { NavigationModule } from './navigation/navigation.module';
import { CategoryModule } from './category/category.module';
import { ProductModule } from './product/product.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '',
      database: 'Products',
      entities: [Navigation, Category, Product],
      // entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // Only for development - creates tables automatically
    }),
    TypeOrmModule.forFeature([Navigation,Category, Product]),
    ScraperModule,
    NavigationModule,
    CategoryModule,
    ProductModule,
  ],
  controllers: [AppController, NavigationController, CategoryController, ProductController],
  providers: [AppService, NavigationService, CategoryService, ProductService],
})
export class AppModule {}
