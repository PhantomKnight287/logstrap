import {
  Module,
  NestModule,
  MiddlewareConsumer,
  DynamicModule,
  Provider,
  Inject,
} from '@nestjs/common';
import { LogsTrapMiddleware } from './middleware';
import { LogsTrapService } from './service';
import { LogsTrapInitOptions as CoreLogsTrapInitOptions } from '@logstrap/core';
import { ClsMiddleware, ClsModule } from 'nestjs-cls';
import { RouteInfo } from '@nestjs/common/interfaces';

type LogsTrapInitOptions = CoreLogsTrapInitOptions & {
  exclude: (string | RouteInfo)[];
};

export interface IdModuleAsyncOptions {
  useFactory: (
    ...args: any[]
  ) => Promise<LogsTrapInitOptions> | LogsTrapInitOptions;
  inject?: any[];
}
@Module({})
export class LogsTrapModule implements NestModule {
  constructor(
    @Inject('LOGSTRAP_OPTIONS') private readonly options: LogsTrapInitOptions,
  ) {}
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ClsMiddleware).forRoutes('*');
    consumer
      .apply(LogsTrapMiddleware)
      .exclude(...this.options.exclude)
      .forRoutes('*');
  }

  static forRoot(options: LogsTrapInitOptions): DynamicModule {
    return {
      module: LogsTrapModule,
      global: true,
      providers: [
        {
          provide: 'LOGSTRAP_OPTIONS',
          useValue: options,
        },

        LogsTrapService,
      ],
      exports: [LogsTrapService],
      imports: [ClsModule.forRoot({ middleware: { mount: false } })],
    };
  }

  static forRootAsync(asyncOptions: IdModuleAsyncOptions): DynamicModule {
    return {
      module: LogsTrapMiddleware,
      global: true,
      imports: [
        ...asyncOptions.inject,
        ClsModule.forRoot({
          middleware: {
            mount: false,
          },
        }),
      ],
      providers: [
        this.createAsyncOptionsProvider(asyncOptions),
        LogsTrapService,
      ],
      exports: [LogsTrapService],
    };
  }

  private static createAsyncOptionsProvider(
    options: IdModuleAsyncOptions,
  ): Provider {
    return {
      provide: 'LOGSTRAP_OPTIONS',
      useFactory: options.useFactory,
      inject: options.inject || [],
    };
  }
}
