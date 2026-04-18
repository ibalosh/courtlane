import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import { env } from './config/env';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';

  app.setGlobalPrefix(globalPrefix);
  app.useGlobalFilters(new HttpExceptionFilter());
  app.enableCors({
    origin: env.webAppUrl,
    credentials: true,
  });
  app.use(cookieParser());
  await app.listen(env.apiPort);
  Logger.log(
    `🚀 Application is running on: http://localhost:${env.apiPort}/${globalPrefix}`,
  );
}

bootstrap();
