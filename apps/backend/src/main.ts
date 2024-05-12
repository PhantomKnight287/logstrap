//@ts-expect-error creating custom implementation of toJSON
BigInt.prototype.toJSON = function () {
  return this.toString();
};
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';

import * as morgan from 'morgan';
import { ValidationPipe } from '@nestjs/common';
import { errorSubject$ } from './constants';
import { json } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(morgan('dev'), helmet());
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.use(json({ limit: '50mb' }));
  const port = process.env.PORT || 8000;
  if (process.env.LOGSTRAP_KEY && process.env.LOGSTRAP_PATH)
    errorSubject$.subscribe(async (payload) => {
      if (payload.path === '/logs') return;

      fetch(process.env.LOGSTRAP_PATH, {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {
          'X-API-KEY': process.env.LOGSTRAP_KEY,
          'content-type': 'application/json',
        },
      }).catch(() => {});
    });
  await app.listen(process.env.PORT || 8000);
  console.log(`Up and running at port: ${port}`);
}
bootstrap();
