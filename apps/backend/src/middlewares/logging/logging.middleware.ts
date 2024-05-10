import { NextFunction, Request, Response } from 'express';

import { Injectable, NestMiddleware } from '@nestjs/common';

import { errorSubject$ } from '../../constants';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const originalJson = res.json;

    //@ts-expect-error correct types
    res.json = function (body) {
      errorSubject$.next({
        statusCode: res.statusCode,
        path: req.originalUrl,
        requestHeaders: req.headers,
        requestBody: JSON.stringify(req.body),
        responseHeaders: JSON.parse(JSON.stringify(res.getHeaders())),
        responseBody: JSON.stringify(body),
        method: req.method,
      });

      originalJson.call(this, body);
    };

    next();
  }
}
