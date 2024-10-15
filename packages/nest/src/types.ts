import { Request } from 'express';
import { RouteInfo } from '@nestjs/common/interfaces';
import { LogsTrapInitOptions as CoreLogsTrapInitOptions } from '@logstrap/core';

export type LogsTrapRequest = Request & {
  'x-logstrap-id': string;
};

/**
 * Extended LogsTrap initialization options including route exclusion.
 */
export type LogsTrapInitOptions = CoreLogsTrapInitOptions & {
  /**
   * Routes to exclude from logging. Useful for excluding health check routes.
   */
  exclude: (string | RouteInfo)[];
  /**
   * Status codes to consider as errors.
   * @default [500]
   */
  errorStatusCodes?: number[];
};

/**
 * Interface representing caller information
 */
export interface CallerInfo {
  className: string;
  functionName: string;
}
