import React from 'react';
import {
  unstable_after as after,
  NextRequest,
  NextResponse,
} from 'next/server';
import {
  createEndpointUrl,
  logApiRequest,
  LogsTrapInitOptions,
} from '@logstrap/core';
import { cookies, headers } from 'next/headers';
import { headersToRecord } from './utils';
import { LOGSTRAP_API_KEY, LOGSTRAP_REQUEST_ID } from '@logstrap/constants';
import { configSchema } from './types';
import { z } from 'zod';
import { getStorage } from './storage';

export class WithLoggerFactory {
  private options: LogsTrapInitOptions;

  constructor(options: LogsTrapInitOptions) {
    this.options = options;
  }

  private async parseOptions(options: z.infer<typeof configSchema>) {
    if (!options) throw new Error('Options are required in logger');
    const result = configSchema.safeParse(options);
    if (!result.success)
      throw new Error(`${result.error.errors[0].path} is required in options`);
  }

  pageWithLogger(
    WrappedComponent: React.ComponentType<any>,
    options: z.infer<typeof configSchema>,
  ) {
    return async () => {
      this.parseOptions(options);
      const { cookiesList, headersObject, requestId } =
        await this.getHeadersAndCookies();
      const logsStorage = getStorage();

      after(async () => {
        let applicationLogs = [];
        if (logsStorage instanceof Map) {
          applicationLogs =
            (logsStorage.get(requestId) as Record<string, any>[]) ?? [];
        } else {
          applicationLogs = logsStorage[requestId];
        }
        const res = await logApiRequest(
          await createEndpointUrl(this.options),
          {
            headers: {
              [LOGSTRAP_API_KEY]: this.options.apiKey,
              'content-type': 'application/json',
            },
            method: 'POST',
          },
          {
            requests: [
              {
                method: 'GET',
                statusCode: 200,
                url: options.name,
                applicationLogs,
                cookies: cookiesList,
                ip: headersObject['x-forwarded-for'],
                userAgent: headersObject['user-agent'],
                requestHeaders: headersObject as Record<string, never>,
              },
            ],
          },
        );
        if (res.ok) {
          // remove logs from storage
          if (logsStorage instanceof Map) {
            logsStorage.delete(requestId);
          } else {
            delete logsStorage[requestId];
          }
        }
      });

      return <WrappedComponent />;
    };
  }

  serverActionWithLogger<T extends any>(
    action: (data?: T) => any | Promise<any>,
    options: z.infer<typeof configSchema>,
  ) {
    this.parseOptions(options);

    return async (data?: T) => {
      const { cookiesList, headersObject, requestId } =
        await this.getHeadersAndCookies();
      after(async () => {
        const logsStorage = getStorage();
        let applicationLogs = [];
        if (logsStorage instanceof Map) {
          applicationLogs =
            (logsStorage.get(requestId) as Record<string, any>[]) ?? [];
        } else {
          applicationLogs = logsStorage[requestId];
        }
        const res = await logApiRequest(
          await createEndpointUrl(this.options),
          {
            headers: {
              [LOGSTRAP_API_KEY]: this.options.apiKey,
              'content-type': 'application/json',
            },
            method: 'POST',
          },
          {
            requests: [
              {
                method: 'POST',
                statusCode: 200,
                url: options.name,
                applicationLogs,
                cookies: cookiesList,
                ip: headersObject['x-forwarded-for'],
                userAgent: headersObject['user-agent'],
                requestHeaders: headersObject as Record<string, never>,
              },
            ],
          },
        );
        if (res.ok) {
          // remove logs from storage
          if (logsStorage instanceof Map) {
            logsStorage.delete(requestId);
          } else {
            delete logsStorage[requestId];
          }
        }
      });

      return await action(data);
    };
  }

  routeHandlerWithLogger(
    handler: (req: NextRequest) => NextResponse | Promise<NextResponse>,
    options: z.infer<typeof configSchema>,
  ) {
    this.parseOptions(options);

    return async (req: NextRequest) => {
      const { cookiesList, headersObject, requestId } =
        await this.getHeadersAndCookies();

      const logsStorage = getStorage();

      let applicationLogs = [];
      if (logsStorage instanceof Map) {
        applicationLogs =
          (logsStorage.get(requestId) as Record<string, any>[]) ?? [];
      } else {
        applicationLogs = logsStorage[requestId];
      }

      after(async () => {
        const res = await logApiRequest(
          await createEndpointUrl(this.options),
          {
            headers: {
              [LOGSTRAP_API_KEY]: this.options.apiKey,
              'content-type': 'application/json',
            },
            method: 'POST',
          },
          {
            requests: [
              {
                method: req.method,
                statusCode: 200,
                url: options.name,
                applicationLogs,
                cookies: cookiesList,
                ip: headersObject['x-forwarded-for'],
                userAgent: headersObject['user-agent'],
                requestHeaders: headersObject as Record<string, never>,
              },
            ],
          },
        );
        if (res.ok) {
          // remove logs from storage
          if (logsStorage instanceof Map) {
            logsStorage.delete(requestId);
          } else {
            delete logsStorage[requestId];
          }
        }
      });

      return await handler(req);
    };
  }
  private async getHeadersAndCookies() {
    const headersList = await headers();
    const cookiesList = await cookies();

    const headersObject = headersToRecord(headersList);
    const requestId = headersObject[LOGSTRAP_REQUEST_ID];
    return {
      headersObject,
      cookiesList: JSON.parse(JSON.stringify(cookiesList.getAll())),
      requestId,
    };
  }

  createLoggers() {
    return {
      pageWithLogger: this.pageWithLogger.bind(this),
      serverActionWithLogger: this.serverActionWithLogger.bind(this),
      routeHandlerWithLogger: this.routeHandlerWithLogger.bind(this),
    };
  }
}
