import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggingInterceptor } from './shared/logger/logging.interceptor';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  let port = process.env.PORT || 3000;
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalInterceptors(new LoggingInterceptor());
  app.enableCors({ origin: ['http://localhost:4200'] });
  await app.listen(3000);
  Logger.log(`Server running on http://localhost:${port}`, 'bootstrap');
}

bootstrap();
