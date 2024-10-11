import { getCrypto, LogsTrapInitOptions } from '@logstrap/core';
import { NextRequest } from 'next/server';
import { LOGSTRAP_REQUEST_ID } from '@logstrap/constants';
import { AsyncLocalStorage } from 'async_hooks';
import { headers } from 'next/headers';

const asyncLocalStorage = new AsyncLocalStorage<string[]>();

class Logger {
  private getRequestId() {
    const headersList = headers();
    const id = headersList.get(LOGSTRAP_REQUEST_ID);
    if (!id)
      throw new Error(
        `You are using logger without middleware. Did you forget to add it for this route(${headersList.get('x-url')})?`,
      );
    return id;
  }
  
  info(message: string) {
    const id = this.getRequestId();
    console.log(`[${id}] ${message}`);
  }

  addToStorage(item: string) {
    const currentStorage = asyncLocalStorage.getStore() || [];
    asyncLocalStorage.enterWith([...currentStorage, item]);
  }
}

function middleware(func: Function) {
  return async function (request: NextRequest) {
    const requestId = (await getCrypto()).randomUUID();
    asyncLocalStorage.enterWith([]);
    const newHeaders = new Headers(request.headers);
    newHeaders.set(LOGSTRAP_REQUEST_ID, requestId);
    const newRequest = new NextRequest(request, { headers: newHeaders });
    const response = await func(newRequest);
    response.headers.set(LOGSTRAP_REQUEST_ID, requestId);
    return response;
  };
}

export default function initLogstrap(options: LogsTrapInitOptions) {
  options;
  return {
    middleware,
    logger: new Logger(),
  };
}
