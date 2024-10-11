import { Inject, Injectable, NestMiddleware, Scope } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { NextFunction, Response } from 'express';
import { LogsTrapRequest } from './types';
import {
  logApiRequest,
  LogsTrapInitOptions,
  createEndpointUrl,
} from '@logstrap/core';
import { ClsService } from 'nestjs-cls';
import { LOGSTRAP_REQUEST_ID, LOGSTRAP_API_KEY } from '@logstrap/constants';
/**
 * Middleware for logging API requests and responses using LogsTrap.
 */
@Injectable({ scope: Scope.REQUEST })
export class LogsTrapMiddleware implements NestMiddleware {
  constructor(
    private readonly clsService: ClsService,
    @Inject('LOGSTRAP_OPTIONS')
    private readonly logsTrapOptions: LogsTrapInitOptions,
  ) {}

  /**
   * Middleware function to intercept and log API requests and responses.
   * @param request - The incoming request object.
   * @param response - The outgoing response object.
   * @param next - The next middleware function.
   */
  use(request: LogsTrapRequest, response: Response, next: NextFunction) {
    // Generate a unique ID for each request
    const requestId = randomUUID();
    this.clsService.set(requestId, []);
    request[LOGSTRAP_REQUEST_ID] = requestId;

    const originalJsonMethod = response.json;
    const clsServiceRef = this.clsService;
    const logsTrapOptionsRef = this.logsTrapOptions;

    const startTime = Date.now();

    // Override the json method to intercept the response
    response.json = function (responseBody) {
      const endTime = Date.now();
      const timeTaken = endTime - startTime;

      const applicationLogs = clsServiceRef.get(requestId);
      const requestLog = {
        statusCode: response.statusCode,
        url: request.originalUrl,
        requestHeaders: JSON.parse(JSON.stringify(request.headers)),
        requestBody: request.body,
        responseHeaders: JSON.parse(JSON.stringify(response.getHeaders())),
        responseBody: responseBody,
        method: request.method,
        cookies: request.cookies,
        ip: request.ip,
        userAgent: request.headers['user-agent'],
        applicationLogs: applicationLogs ?? [],
        timeTaken: timeTaken,
      };

      const originalResponse = originalJsonMethod.call(this, responseBody);

      // Asynchronously log the request
      (async () => {
        try {
          const endpointUrl = await createEndpointUrl(logsTrapOptionsRef);
          const response = await logApiRequest(
            endpointUrl,
            {
              method: 'POST',
              headers: {
                [LOGSTRAP_API_KEY]: logsTrapOptionsRef.apiKey,
                'content-type': 'application/json',
              },
            },
            {
              requests: [requestLog],
            },
          );
          if (!response.ok) {
            console.error(await response.json());
          }
        } catch (error) {
          console.error('Failed to log API request:', error);
        }
      })();

      return originalResponse;
    };

    next();
  }
}
