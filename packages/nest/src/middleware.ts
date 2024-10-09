import { Inject, Injectable, NestMiddleware, Scope } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { NextFunction, Response } from 'express';
import { LogsTrapRequest } from './types';
import { LogsTrapService } from './service';
import {
  logApiRequest,
  LogsTrapInitOptions,
  createEndpointUrl,
} from '@logstrap/core';
import { promisify } from 'util';
import { ClsService } from 'nestjs-cls';

const wait = promisify(setTimeout);

@Injectable({ scope: Scope.REQUEST })
export class LogsTrapMiddleware implements NestMiddleware {
  constructor(
    private readonly cls: ClsService,
    @Inject('LOGSTRAP_OPTIONS') private readonly options: LogsTrapInitOptions,
  ) {}
  use(req: LogsTrapRequest, res: Response, next: NextFunction) {
    // attaching the id for each request
    const id = randomUUID();
    this.cls.set(id, []);
    req['x-logstrap-id'] = id;
    const originalJson = res.json;
    const cls = this.cls;
    const options = this.options;
    res.json = function (body) {
      const logs = cls.get(id);
      const requestLog = {
        statusCode: res.statusCode,
        url: req.originalUrl,
        requestHeaders: req.headers,
        requestBody: req.body,
        responseHeaders: res.getHeaders(),
        responseBody: body,
        method: req.method,
        cookies: req.cookies,
        ip: req.ip,
        userAgent: req.headers['user-agent'],
        applicationLogs: (logs as any) ?? [],
      };
      const resp = originalJson.call(this, body);
      (async () => {
        const data = await logApiRequest(
          await createEndpointUrl(options),
          {
            method: 'POST',
            headers: {
              'x-api-key': options.apiKey,
              'content-type': 'application/json',
            },
          },
          {
            //@ts-ignore
            requests: [requestLog],
          },
        );
        const body = await data.json();
        console.log(body);
      })();
      return resp;
    };
    next();
  }
}
