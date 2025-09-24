import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Navigation } from './entities/navigation.entity';
import { Category } from './entities/category.entity';
import { Product } from './entities/product.entity';
import { ScraperModule } from './scrapper/scrapper.module';
import { NavigationModule } from './navigation/navigation.module';
import { CategoryModule } from './category/category.module';
import { ProductModule } from './product/product.module';
import { CacheModule} from '@nestjs/cache-manager';
import { ConfigModule, ConfigService} from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: 5432,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      ssl: {
          rejectUnauthorized: false,  // necessary if using self-signed certs
      },
      entities: [Navigation, Category, Product],
      synchronize: true, // For development only; disable in production
      logging: true,
      
      }),
    inject: [ConfigService],
    }),
    ScraperModule,
    NavigationModule,
    CategoryModule,
    ProductModule,
    CacheModule.register({
      ttl: 5,
      max: 100,
      isGlobal: true, // <-- important flag
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}