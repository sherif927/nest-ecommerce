import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggingInterceptor } from './shared/logger/logging.interceptor';
import { Logger } from '@nestjs/common';
import { HttpExceptionFilter } from './shared/exception-filter/exception.filter';

async function bootstrap() {
  let port = process.env.PORT || 3000;
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalInterceptors(new LoggingInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(3000);
  Logger.log(`Server running on http://localhost:${port}`, 'bootstrap');
}

bootstrap();
