// import 'source-map-support';
import { LogsTrapInitOptions } from '@logstrap/core';
import { createRouteHandlerWithLogger } from './app';
import { withTracing } from './middleware';
import { logger } from './logger';
import { WithLoggerFactory } from './wrapper';

export function initLogstrap(options: LogsTrapInitOptions) {
  return {
    withTracing,
    logger,
    createRouteHandler: createRouteHandlerWithLogger(options),
    withLoggerFactory: new WithLoggerFactory(options),
  };
}
