import { LogsTrapInitOptions } from '@logstrap/core';
import { createRouteHandlerWithLogger } from './app';
import { withTracing } from './middleware';
import { logger } from './logger';

export function initLogstrap(options: LogsTrapInitOptions) {
  return {
    withTracing,
    logger,
    createRouteHandler: createRouteHandlerWithLogger(options),
  };
}
