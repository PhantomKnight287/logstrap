import { CallerInfo, getCallerInfo } from '@logstrap/core';
import { context } from './storage';

export class Logger {
  private getCallerInfo(): CallerInfo {
    return getCallerInfo(new Error().stack);
  }

  private getStore() {
    const storage = context.getStore() as Array<Record<string, any>>;
    if (!storage)
      throw new Error(
        'No context found. Did you forget to use the LogsTrap middleware?',
      );
    return storage;
  }
  /**
   * Adds a log entry to the storage
   */
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
    this.getStore().push(newLogEntry);
  }
  public warn(message?: any, ...optionalParams: any[]) {
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

  public log(message?: any, ...optionalParams: any[]) {
    const caller = this.getCallerInfo();
    this.addLogToStorage(
      'log',
      caller.functionName,
      caller.className,
      message,
      optionalParams.length ? { params: optionalParams } : {},
    );
  }

  /**
   * Logs an error message
   */
  public error(message?: any, ...optionalParams: any[]) {
    console.error(message, ...optionalParams);
    const caller = this.getCallerInfo();
    const error = new Error();
    const stack = error.stack
      ?.split('\n')
      .slice(2)
      .map((line) => line.trim())
      .join('\n');
    this.addLogToStorage(
      'error',
      caller.functionName,
      caller.className,
      message,
      {
        ...(optionalParams.length ? { params: optionalParams } : {}),
        stack,
      },
    );
  }
  /**
   * Logs an info message
   */
  public info(message?: any, ...optionalParams: any[]) {
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

  /**
   * Logs a trace message
   */
  public trace(message?: any, ...optionalParams: any[]) {
    console.trace(message, ...optionalParams);
    const caller = this.getCallerInfo();
    const error = new Error();
    const stack = error.stack?.split('\n').slice(2).join('\n');
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
}
