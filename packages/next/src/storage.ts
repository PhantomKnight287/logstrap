import { LOGSTRAP_REQUEST_ID } from '@logstrap/constants';
import { asyncLocalStorage } from '@nextwrappers/async-local-storage';
import type { NextRequest } from 'next/server';
import { generateId } from '@logstrap/core';

export const {
  wrapper: withAsyncLocalStorage,
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
      [LOGSTRAP_REQUEST_ID]: generateId(),
      url: request.nextUrl.pathname,
      requestHeaders,
      method: request.method,
      host: request.headers.get('host'),
      cookies: request.cookies.getAll(),
      //@ts-expect-error
      ip: request.ip,
      userAgent: request.headers.get('user-agent'),
      timestamp: new Date().toISOString(),
      applicationLogs: [],
    } as Record<string, any>;
  },
});

export function getStorage():
  | Map<string, Record<string, any> | Record<string, any>[]>
  | Record<string, any> {
  let storage = (globalThis as any).logstrap_storage;
  if (!storage) {
    storage = new Map<string, Record<string, any> | Record<string, any>[]>();
    (globalThis as any).logstrap_storage = storage;
  }
  return storage;
}
