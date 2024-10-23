import { LOGSTRAP_REQUEST_ID } from '@logstrap/constants';
import { CallerInfo, getCallerInfo, logApiRequest } from '@logstrap/core';
import { headers } from 'next/headers';

// const { remember } = await import('@epic-web/remember');

export class Logger {
  private storage: Map<string, Record<string, any> | Record<string, any>[]>;
  constructor() {
    this.storage = this.getStorage();
  }

  async addRequestToStorage(
    requestId: string,
    store: Exclude<
      Parameters<typeof logApiRequest>[2]['requests'],
      undefined
    >[0],
  ): Promise<void> {
    return new Promise<void>((resolve) => {
      this.storage.set(requestId, store);
      resolve();
    });
  }

  private getStorage(): Map<
    string,
    Record<string, any> | Record<string, any>[]
  > {
    let storage = (globalThis as any).logstrap_storage;
    if (!storage) {
      storage = new Map<string, Record<string, any> | Record<string, any>[]>();
      (globalThis as any).logstrap_storage = storage;
    }
    return storage;
  }

  private addLogToStorage(
    logLevel: string,
    callerName: string,
    component: string | null,
    message: any,
    additionalInfo: Record<string, any> = {},
  ) {
    const newLogEntry = {
      timestamp: new Date(),
      level: logLevel,
      message: typeof message === 'string' ? message : JSON.stringify(message),
      functionName: callerName,
      component,
      additionalInfo,
    };

    this.addToStorage(newLogEntry);
  }

  /**
   * Get the request id from the server. Without it, the logs will be treated as standalone logs.
   */
  private getRequestId(): string | undefined | null {
    const headersList = headers();
    const requestId = headersList.get(LOGSTRAP_REQUEST_ID);
    return requestId;
  }

  private getCallerInfo(): CallerInfo {
    return getCallerInfo(new Error().stack);
  }

  log(message?: any, ...optionalParams: any[]) {
    console.log(message, ...optionalParams);
    const caller = this.getCallerInfo();
    this.addLogToStorage(
      'log',
      caller.functionName,
      caller.className,
      message,
      optionalParams.length ? { params: optionalParams } : {},
    );
  }

  warn(message?: any, ...optionalParams: any[]) {
    console.warn(message, ...optionalParams);
    const caller = this.getCallerInfo();
    this.addLogToStorage(
      'warn',
      caller.functionName,
      caller.className,
      message,
      optionalParams.length ? { params: optionalParams } : {},
    );
  }

  error(message?: any, ...optionalParams: any[]) {
    console.error(message, ...optionalParams);
    const caller = this.getCallerInfo();
    this.addLogToStorage(
      'error',
      caller.functionName,
      caller.className,
      message,
      optionalParams.length ? { params: optionalParams } : {},
    );
  }

  info(message?: any, ...optionalParams: any[]) {
    console.info(message, ...optionalParams);
    const caller = this.getCallerInfo();
    this.addLogToStorage(
      'info',
      caller.functionName,
      caller.className,
      message,
      optionalParams.length ? { params: optionalParams } : {},
    );
  }

  trace(message?: any, ...optionalParams: any[]) {
    console.trace(message, ...optionalParams);
    const caller = this.getCallerInfo();
    const error = new Error();
    const stack = error.stack
      ?.split('\n')
      .slice(2)
      .map((line) => line.trim())
      .join('\n');
    this.addLogToStorage(
      'trace',
      caller.functionName,
      caller.className,
      message,
      {
        ...(optionalParams.length ? { params: optionalParams } : {}),
        stack,
      },
    );
  }

  debug(message?: any, ...optionalParams: any[]) {
    console.debug(message, ...optionalParams);
    const caller = this.getCallerInfo();
    this.addLogToStorage(
      'debug',
      caller.functionName,
      caller.className,
      message,
      optionalParams.length ? { params: optionalParams } : {},
    );
  }

  private addToStorage(item: Record<string, any>) {
    const requestId = this.getRequestId();
    const storage = this.getStorage();
    if (!requestId) {
      const olderStandaloneLogs = storage.get('STANDALONE_LOGS') || [];
      storage.set('STANDALONE_LOGS', [
        ...(olderStandaloneLogs as Record<string, any>[]),
        item,
      ]);
    } else {
      const currentRequestLogs = storage.get(requestId) || {};
      storage.set(requestId, {
        ...currentRequestLogs,
        additionalLogs: [
          ...((currentRequestLogs as any).additionalLogs || []),
          { ...item, requestId },
        ],
      });
    }
  }
}

export const logger = new Logger();
