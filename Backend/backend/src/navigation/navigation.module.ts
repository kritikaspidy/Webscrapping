// navigation.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Navigation } from '../entities/navigation.entity';
import { NavigationService } from './navigation.service';
import { NavigationController } from './navigation.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Navigation])],
  controllers: [NavigationController],
  providers: [NavigationService],
  exports: [NavigationService], // export to share with other modules
})
export class NavigationModule {}
