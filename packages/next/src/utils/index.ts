import { LOGSTRAP_REQUEST_ID } from '@logstrap/constants';
import { asyncLocalStorage } from '@nextwrappers/async-local-storage';
import type { NextRequest } from 'next/server';

export const {
  wrapper: asyncLocalStorageWrapped,
  getStore: getLogsStorage,
  storage,
} = asyncLocalStorage({
  //@ts-expect-error This function expects Request but NextRequest is also compatible
  initialize: (request: NextRequest) => {
    const headers = new Headers(request.headers);
    const requestHeaders: Record<string, any> = {};
    //@ts-expect-error
    for (const [key, value] of headers.entries()) {
      requestHeaders[key] = value;
    }
    return {
      [LOGSTRAP_REQUEST_ID]: crypto.randomUUID(),
      url: request.nextUrl.pathname,
      requestHeaders,
      method: request.method,
      host: request.headers.get('host'),
      cookies: request.cookies.getAll(),
      ip: request.ip,
      userAgent: request.headers.get('user-agent'),
      timestamp: new Date().toISOString(),
      applicationLogs: [],
    } as Record<string, any>;
  },
});
