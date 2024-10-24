import { LOGSTRAP_REQUEST_ID } from '@logstrap/constants';
import { CallerInfo, getCallerInfo } from '@logstrap/core';
import { headers } from 'next/headers';
import { getStorage } from './storage';

// const { remember } = await import('@epic-web/remember');

export class Logger {
  constructor() {}
  private async addLogToStorage(
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

    await this.addToStorage(newLogEntry);
  }

  /**
   * Get the request id from the server. Without it, the logs will be treated as standalone logs.
   */
  private async getRequestId(): Promise<string | null | undefined> {
    const headersList = await headers();
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
    ).catch(console.error);
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

  private async addToStorage(item: Record<string, any>) {
    const requestId = await this.getRequestId();
    const storage = getStorage();
    const isMap = storage instanceof Map;
    if (!requestId) {
      const olderStandaloneLogs =
        (isMap ? storage.get('STANDALONE_LOGS') : storage['STANDALONE_LOGS']) ||
        [];

      if (isMap) {
        storage.set('STANDALONE_LOGS', [
          ...(olderStandaloneLogs as Record<string, any>[]),
          item,
        ]);
      } else {
        storage['STANDALONE_LOGS'] = [
          ...(olderStandaloneLogs as Record<string, any>[]),
          item,
        ];
      }
    } else {
      const currentRequestLogs =
        (isMap ? storage.get(requestId) : storage[requestId]) || [];
      if (isMap) {
        storage.set(requestId, [...currentRequestLogs, { ...item, requestId }]);
      } else {
        storage[requestId] = [...currentRequestLogs, { ...item, requestId }];
      }
    }
  }
}

export const logger = new Logger();
