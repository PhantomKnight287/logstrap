import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './resources/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { AuthMiddleware } from './middlewares/auth/auth.middleware';
import { ProjectModule } from './resources/project/project.module';
import { ApiKeysModule } from './resources/api-keys/api-keys.module';
import { LogsModule } from './resources/logs/logs.module';
import { ApiKeyMiddleware } from './middlewares/api-key/api-key.middleware';
import { LoggingMiddleware } from './middlewares/logging/logging.middleware';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from './filters/all/all.filter';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    ProjectModule,
    ApiKeysModule,
    LogsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*');

    consumer
      .apply(AuthMiddleware)
      .exclude(
        {
          path: '/auth/(.*)',
          method: RequestMethod.POST,
        },
        {
          path: '/logs/',
          method: RequestMethod.POST,
        },
        {
          path: '/logs',
          method: RequestMethod.POST,
        },
      )
      .forRoutes('*');

    consumer.apply(ApiKeyMiddleware).forRoutes(
      {
        path: '/logs/',
        method: RequestMethod.POST,
      },
      {
        path: '/logs',
        method: RequestMethod.POST,
      },
    );
  }
}
