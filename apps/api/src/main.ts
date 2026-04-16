import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';
  const webOrigin = process.env['WEB_ORIGIN'] || 'http://localhost:4200';

  app.setGlobalPrefix(globalPrefix);
  app.enableCors({
    origin: webOrigin,
    credentials: true,
  });
  app.use(cookieParser());
  const port = process.env.PORT || 3000;
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`,
  );
}

bootstrap();
