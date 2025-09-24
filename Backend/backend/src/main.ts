import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './http-exception.filter';
import { LoggingInterceptor } from './logging.interceptor';
import 'dotenv/config';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS
  app.enableCors({
    origin: 'http://localhost:3001',
  });

  // Apply validation pipe globally
  app.useGlobalPipes(new ValidationPipe());

  // Apply exception filter globally
  app.useGlobalFilters(new HttpExceptionFilter());

  // Apply logging interceptor globally
  app.useGlobalInterceptors(new LoggingInterceptor());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
