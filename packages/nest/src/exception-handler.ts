import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Inject,
  RequestMethod,
} from '@nestjs/common';
import { LogsTrapRequest } from './types';
import { LOGSTRAP_REQUEST_ID } from '@logstrap/constants';
import { ClsService } from 'nestjs-cls';
import { Response } from 'express';
import type { LogsTrapInitOptions } from './types';
import { DEFAULT_ERROR_STATUS_CODES, LOGSTRAP_OPTIONS } from './constants';
import { getCallerInfo } from '@logstrap/core';
import { RouteInfo } from '@nestjs/common/interfaces';

@Catch()
export class LogsTrapExceptionHandler implements ExceptionFilter {
  constructor(
    private readonly clsService: ClsService,
    @Inject(LOGSTRAP_OPTIONS) private readonly options: LogsTrapInitOptions,
  ) {}
  catch(exception: Error, host: ArgumentsHost) {
    const req = host.switchToHttp().getRequest<LogsTrapRequest>();
    const res = host.switchToHttp().getResponse<Response>();
    const requestId = req[LOGSTRAP_REQUEST_ID];
    const existingLogs = this.clsService.get(requestId);
    const statusCode =
      exception instanceof HttpException ? exception.getStatus() : 500;
    if (this.options.exclude) {
      const isExcluded = this.options.exclude.some(
        (route: string | RouteInfo) => {
          if (typeof route === 'string') {
            return this.matchPath(route, req.url);
          }
          return (
            Object.values(RequestMethod).includes(route.method) &&
            this.matchPath(route.path, req.url)
          );
        },
      );
      if (isExcluded) {
        console.error(exception);
        return res.status(statusCode).json({
          statusCode: statusCode,
          message: exception.message,
        });
      }
    }

    const errorStatusCodes =
      this.options.errorStatusCodes ?? DEFAULT_ERROR_STATUS_CODES;
    if (errorStatusCodes.includes(statusCode)) {
      const callerInfo = getCallerInfo(exception.stack);
      this.clsService.set(requestId, [
        ...(Array.isArray(existingLogs) ? existingLogs : []),
        {
          level: 'error',
          message: exception.message,
          additionalInfo: {
            stack: exception.stack,
          },
          functionName: callerInfo.functionName,
          component: callerInfo.className,
        },
      ]);
    }
    console.log(exception);
    return res.status(statusCode).json({
      statusCode: statusCode,
      message: exception.message,
    });
  }
  private matchPath(pattern: string | RegExp, path: string): boolean {
    // If pattern is already a RegExp, use it directly
    if (pattern instanceof RegExp) {
      return pattern.test(path);
    }
    const normalizedPath = this.normalizePath(path);
    try {
      // Try to create a RegExp from the string pattern
      const regexPattern = new RegExp(pattern);
      return regexPattern.test(normalizedPath);
    } catch (e) {
      // If the pattern is not a valid regex, fall back to the previous logic
      const normalizedPattern = this.normalizePattern(pattern);

      // If exact match
      if (!this.hasWildcard(normalizedPattern)) {
        return normalizedPattern === normalizedPath;
      }

      // Convert string pattern to RegExp
      const fallbackRegexPattern = this.patternToRegex(normalizedPattern);
      return fallbackRegexPattern.test(normalizedPath);
    }
  }

  private normalizePattern(pattern: string): string {
    // Remove trailing slash unless it's the root path
    return pattern === '/' ? '/' : pattern.replace(/\/+$/, '');
  }

  private normalizePath(path: string): string {
    // Remove query parameters and trailing slash
    return path.split('?')[0].replace(/\/+$/, '') || '/';
  }

  private hasWildcard(pattern: string): boolean {
    return pattern.includes('*') || pattern.includes(':');
  }

  private patternToRegex(pattern: string): RegExp {
    // Escape special regex characters except * and :
    const escaped = pattern.replace(/[-\/\\^$+?.()|[\]{}]/g, '\\$&');

    // Convert route parameters (:param) to named capture groups
    const parameterized = escaped.replace(/:([a-zA-Z0-9_]+)/g, '([^/]+)');

    // Convert wildcards to regex patterns
    const wildcarded = parameterized
      .replace(/\*/g, '.*')
      .replace(/\.\.\./g, '.*');

    return new RegExp(`^${wildcarded}$`);
  }
}
