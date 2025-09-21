import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Navigation } from '../entities/navigation.entity';
import { NavigationService } from './navigation.service';
import { NavigationController } from './navigation.controller';
import { ScraperModule } from '../scrapper/scrapper.module';

@Module({
  imports: [TypeOrmModule.forFeature([Navigation]), forwardRef(() => ScraperModule)],
  providers: [NavigationService],
  controllers: [NavigationController],
  exports: [NavigationService],
})
export class NavigationModule {}
