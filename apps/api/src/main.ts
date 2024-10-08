import { config } from 'dotenv';
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import morgan from 'morgan';
import { writeFileSync } from 'node:fs';
import { apiReference } from '@scalar/nestjs-api-reference';
import { WinstonModule } from 'nest-winston';
import { loggerInstance } from '~/logger/winston.config';
import { CustomValidationPipe } from './pipes/validation/validation.pipe';
import path from 'node:path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      instance: loggerInstance,
    }),
  });
  app.enableCors({});
  app.use(
    morgan('dev'),
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'", 'https://cdn.jsdelivr.net'],
          styleSrc: ["'self'", "'unsafe-inline'", 'https://cdn.jsdelivr.net'],
          imgSrc: ["'self'", 'data:', 'https:', 'blob:'],
        },
      },
    }),
  );
  app.useGlobalPipes(
    new CustomValidationPipe({
      whitelist: true,
    }),
  );
  const openAPIConfig = new DocumentBuilder()
    .setTitle('LogsTrap')
    .setDescription('A functional logging solution')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
        'x-tokenName': 'Token',
      },
      'JWT-auth',
    )
    .addApiKey(
      {
        type: 'apiKey',
        name: 'x-api-key',
        in: 'header',
      },
      'Api-Key',
    )
    .build();
  const document = SwaggerModule.createDocument(app, openAPIConfig);
  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector), {
      strategy: 'exposeAll',
      excludeExtraneousValues: true,
    }),
  );
  Object.values(document.paths).forEach((path: any) => {
    Object.values(path).forEach((method: any) => {
      if (!method.responses) {
        method.responses = {};
      }
      method.responses['500'] = {
        description: 'Internal server error.',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/GenericErrorEntity',
            },
          },
        },
      };
    });
  });
  writeFileSync('./openapi.spec.json', JSON.stringify(document, undefined, 2));
  app.use(
    '/reference',
    apiReference({
      spec: {
        content: document,
      },
      layout: 'modern',
      isEditable: false,
      metaData: {
        title: 'LogsTrap - Api Reference',
        description: 'LogsTrap API Documentation',
      },
    }),
  );
  await app.listen(process.env.PORT || 5000);
}
bootstrap();
