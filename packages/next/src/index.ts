import { LogsTrapInitOptions } from '@logstrap/core';
import { NextRequest } from 'next/server';
import { createRouteHandlerWithLogger } from './app';
import { CallerInfo, getCallerInfo } from '@logstrap/core';
import { getLogsStorage, storage } from './utils';

class Logger {
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
    const currentStorage = getLogsStorage();
    if (!currentStorage) throw new Error('Unable to access Logs Storage');
    storage.enterWith({
      ...currentStorage,
      applicationLogs: [...currentStorage.applicationLogs, item],
    });
  }
}

function middleware(func: Function) {
  return async function (request: NextRequest) {
    await func(request);
  };
}

export default function initLogstrap(options: LogsTrapInitOptions) {
  return {
    middleware,
    logger: new Logger(),
    createRouteHandler: createRouteHandlerWithLogger(options),
  };
}
