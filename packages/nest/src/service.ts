import { LogsTrapInitOptions, logApiRequest } from '@logstrap/core';
import { Injectable, Scope, Inject } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { ClsService } from 'nestjs-cls';
import type { CallerInfo, LogsTrapRequest } from './types';
import { LOGSTRAP_REQUEST_ID } from '@logstrap/constants';
import { getCallerInfo } from './utils';
/**
 * Service for handling LogsTrap functionality
 */
@Injectable({ scope: Scope.REQUEST })
export class LogsTrapService {
  constructor(
    @Inject(REQUEST) private readonly request: LogsTrapRequest,
    @Inject('LOGSTRAP_OPTIONS') private readonly options: LogsTrapInitOptions,
    private readonly clsService: ClsService,
  ) {}

  /**
   * Retrieves the unique identifier for the current request
   */
  private getRequestId(): string {
    const id = this.request[LOGSTRAP_REQUEST_ID];
    if (!id)
      throw new Error(
        `You are trying to log without LogsTrap middleware. Did you add this route(${this.request.url}) in exclude array?`,
      );
    return id;
  }

  /**
   * Adds a log entry to the storage
   */
  private addLogToStorage(
    requestId: string,
    logLevel: string,
    callerName: string,
    component: string | null,
    message: any,
    ...additionalInfo: any[]
  ) {
    const existingLogs = this.clsService.get(requestId);
    const newLogEntry = {
      timestamp: new Date(),
      level: logLevel,
      message: typeof message === 'string' ? message : JSON.stringify(message),
      functionName: callerName,
      component,
      ...additionalInfo,
    };

    if (existingLogs) {
      this.clsService.set(requestId, [...existingLogs, newLogEntry]);
    } else {
      this.clsService.set(requestId, [newLogEntry]);
    }
  }

  /**
   * Logs a warning message
   */
  public warn(message?: any, ...optionalParams: any[]) {
    const requestId = this.getRequestId();
    console.warn(message, ...optionalParams);
    const caller = this.getCallerInfo();
    this.addLogToStorage(
      requestId,
      'warn',
      caller.functionName,
      caller.className,
      message,
      ...optionalParams,
    );
  }

  /**
   * Logs an informational message
   */
  public log(message?: any, ...optionalParams: any[]) {
    const requestId = this.getRequestId();
    const caller = this.getCallerInfo();
    this.addLogToStorage(
      requestId,
      'log',
      caller.functionName,
      caller.className,
      message,
      ...optionalParams,
    );
  }

  /**
   * Logs an error message
   */
  public error(message?: any, ...optionalParams: any[]) {
    const requestId = this.getRequestId();
    console.error(message, ...optionalParams);
    const caller = this.getCallerInfo();
    this.addLogToStorage(
      requestId,
      'error',
      caller.functionName,
      caller.className,
      message,
      ...optionalParams,
    );
  }

  /**
   * Logs an info message
   */
  public info(message?: any, ...optionalParams: any[]) {
    const requestId = this.getRequestId();
    console.info(message, ...optionalParams);
    const caller = this.getCallerInfo();
    this.addLogToStorage(
      requestId,
      'info',
      caller.functionName,
      caller.className,
      message,
      ...optionalParams,
    );
  }

  /**
   * Logs a trace message
   */
  public trace(message?: any, ...optionalParams: any[]) {
    const requestId = this.getRequestId();
    console.trace(message, ...optionalParams);
    const caller = this.getCallerInfo();
    this.addLogToStorage(
      requestId,
      'trace',
      caller.functionName,
      caller.className,
      message,
      ...optionalParams,
    );
  }

  /**
   * Retrieves information about the caller of the log method
   */
  private getCallerInfo(): CallerInfo {
    return getCallerInfo(new Error().stack);
  }
}
