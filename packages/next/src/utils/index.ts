import { LOGSTRAP_REQUEST_ID } from '@logstrap/constants';
import { asyncLocalStorage } from '@nextwrappers/async-local-storage';
import type { NextRequest } from 'next/server';
import { generateId } from '@logstrap/core';

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
      [LOGSTRAP_REQUEST_ID]: generateId(),
      url: request.nextUrl.pathname,
      requestHeaders,
      method: request.method,
      host: request.headers.get('host'),
      cookies: request.cookies.getAll(),
      ip: request.headers.get('x-forwarded-for'),
      userAgent: request.headers.get('user-agent'),
      timestamp: new Date().toISOString(),
      applicationLogs: [],
    } as Record<string, any>;
  },
});

export function parseJsonOrPassthrough<T>(input: T) {
  try {
    return JSON.parse(String(input));
  } catch {
    return input;
  }
}

export function headersToRecord(headers: Headers) {
  const headersRecord: Record<string, string> = {};
  headers.forEach((value, key) => {
    headersRecord[key] = value;
  });

  return headersRecord;
}

export function buildJsonLog<T extends object>(logs: Array<Partial<T>>) {
  const logsObj: Record<string, unknown> = {};
  for (let i = 0; i < logs.length; i++) {
    Object.entries(logs[i]).forEach(([key, value]) => {
      logsObj[key] = value;
    });
  }
  return logsObj as T;
}

export function buildTextLog(logObject: object) {
  return Object.entries(logObject)
    .map(([key, value]) => `${key}=${JSON.stringify(value)}`)
    .join(' ');
}

export function sendLogToApi<T>(
  log: T,
  logsEndpoint: string,
  flytrapPublicKey?: string,
) {
  return fetch(logsEndpoint, {
    method: 'POST',
    body: JSON.stringify(log),
    headers: new Headers({
      'Content-Type': 'application/json',
      ...(flytrapPublicKey && {
        Authorization: `Bearer ${flytrapPublicKey}`,
      }),
    }),
    keepalive: true,
  }).then(async (res) => {
    if (res.ok === false) {
      console.error('Flytrap Logs SDK: Failed to save logs to API. Error:');
      console.error(await res.text());
    }
  });
}
