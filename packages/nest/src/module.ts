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
import { ClsMiddleware, ClsModule } from 'nestjs-cls';
import { APP_FILTER } from '@nestjs/core';
import { LogsTrapExceptionHandler } from './exception-handler';
import { LOGSTRAP_OPTIONS } from './constants';
import type { LogsTrapInitOptions } from './types';

/**
 * Async options for LogsTrap module initialization.
 */
export interface LogsTrapModuleAsyncOptions {
  useFactory: (
    ...args: any[]
  ) => Promise<LogsTrapInitOptions> | LogsTrapInitOptions;
  inject?: any[];
}

/**
 * LogsTrap module for NestJS applications.
 * Provides request logging and application logging capabilities.
 */
@Module({})
export class LogsTrapModule implements NestModule {
  constructor(
    @Inject(LOGSTRAP_OPTIONS) private readonly options: LogsTrapInitOptions,
  ) {}

  /**
   * Configures the middleware for the module.
   * @param consumer - The MiddlewareConsumer to configure.
   */
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ClsMiddleware).forRoutes('*');
    consumer
      .apply(LogsTrapMiddleware)
      .exclude(...this.options.exclude)
      .forRoutes('*');
  }

  /**
   * Creates a dynamic module with synchronous configuration.
   * @param options - The LogsTrap initialization options.
   * @returns A DynamicModule configuration.
   */
  static forRoot(options: LogsTrapInitOptions): DynamicModule {
    return {
      module: LogsTrapModule,
      global: true,
      providers: [
        {
          provide: LOGSTRAP_OPTIONS,
          useValue: options,
        },
        LogsTrapService,
        {
          provide: APP_FILTER,
          useClass: LogsTrapExceptionHandler,
        },
      ],
      exports: [LogsTrapService],
      imports: [ClsModule.forRoot({ middleware: { mount: false } })],
    };
  }

  /**
   * Creates a dynamic module with asynchronous configuration.
   * @param asyncOptions - The async options for module initialization.
   * @returns A DynamicModule configuration.
   */
  static forRootAsync(asyncOptions: LogsTrapModuleAsyncOptions): DynamicModule {
    return {
      module: LogsTrapModule,
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
        {
          provide: APP_FILTER,
          useClass: LogsTrapExceptionHandler,
        },
      ],
      exports: [LogsTrapService],
    };
  }

  /**
   * Creates an async options provider for the module.
   * @param options - The async options for module initialization.
   * @returns A Provider configuration.
   */
  private static createAsyncOptionsProvider(
    options: LogsTrapModuleAsyncOptions,
  ): Provider {
    return {
      provide: LOGSTRAP_OPTIONS,
      useFactory: options.useFactory,
      inject: options.inject || [],
    };
  }
}
