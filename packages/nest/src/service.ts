import {
  LogsTrapInitOptions,
  createEndpointUrl,
  logApiRequest,
  getCallerInfo,
  CallerInfo,
} from '@logstrap/core';
import { Injectable, Scope, Inject } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import type { LogsTrapRequest } from './types';
import { LOGSTRAP_API_KEY, LOGSTRAP_REQUEST_ID } from '@logstrap/constants';
import { LOGSTRAP_OPTIONS } from './constants';
import { REQUEST } from '@nestjs/core';

/**
 * Logger that can be used to log messages without an active request. Does not require LogsTrap middleware.
 */
@Injectable({ scope: Scope.TRANSIENT })
export class StandaloneLogsTrapService {
  private readonly storage = new Array<any>();

  constructor(
    @Inject(LOGSTRAP_OPTIONS)
    private readonly logsTrapOptions: LogsTrapInitOptions,
  ) {
    setInterval(() => {
      this.postLogs();
    }, 5000); // every 5 seconds
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

    this.storage.push(newLogEntry);
  }

  private async postLogs() {
    const currentLogs = this.storage;
    if (!currentLogs.length) return;
    try {
      const endpointUrl = await createEndpointUrl(this.logsTrapOptions);

      const res = await logApiRequest(
        endpointUrl,
        {
          method: 'POST',
          headers: {
            [LOGSTRAP_API_KEY]: this.logsTrapOptions.apiKey,
            'content-type': 'application/json',
          },
        },
        {
          applicationLogs: currentLogs,
        },
      );
      if (!res.ok) {
        console.error(await res.json());
      }
      // remove logs from storage which were accessed above, ensuring no new logs are deleted from the storage
      this.storage.splice(0, currentLogs.length);
    } catch (e) {
      console.error('Failed to log standalone logs:', e);
    }
  }

  private getCallerInfo(): CallerInfo {
    return getCallerInfo(new Error().stack);
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
    console.log(message, ...optionalParams);
  }

  public error(message?: any, ...optionalParams: any[]) {
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
    console.error(message, ...optionalParams);
  }

  public warn(message?: any, ...optionalParams: any[]) {
    const caller = this.getCallerInfo();
    this.addLogToStorage(
      'warn',
      caller.functionName,
      caller.className,
      message,
      optionalParams.length ? { params: optionalParams } : {},
    );
    console.warn(message, ...optionalParams);
  }

  public info(message?: any, ...optionalParams: any[]) {
    const caller = this.getCallerInfo();
    this.addLogToStorage(
      'info',
      caller.functionName,
      caller.className,
      message,
      optionalParams.length ? { params: optionalParams } : {},
    );
    console.info(message, ...optionalParams);
  }

  public trace(message?: any, ...optionalParams: any[]) {
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
    console.trace(message, ...optionalParams);
  }

  public fatal(message?: any, ...optionalParams: any[]) {
    const caller = this.getCallerInfo();
    const error = new Error();
    const stack = error.stack
      ?.split('\n')
      .slice(2)
      .map((line) => line.trim())
      .join('\n');
    this.addLogToStorage(
      'fatal',
      caller.functionName,
      caller.className,
      message,
      {
        ...(optionalParams.length ? { params: optionalParams } : {}),
        stack,
      },
    );
    console.error(message, ...optionalParams);
  }

  public debug(message?: any, ...optionalParams: any[]) {
    const caller = this.getCallerInfo();
    this.addLogToStorage(
      'debug',
      caller.functionName,
      caller.className,
      message,
      optionalParams.length ? { params: optionalParams } : {},
    );
    console.debug(message, ...optionalParams);
  }
}

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
    additionalInfo: Record<string, any> = {},
  ) {
    const existingLogs = this.clsService.get(requestId);
    const newLogEntry = {
      timestamp: new Date(),
      level: logLevel,
      message: typeof message === 'string' ? message : JSON.stringify(message),
      functionName: callerName,
      component,
      additionalInfo,
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
      optionalParams.length ? { params: optionalParams } : {},
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
      optionalParams.length ? { params: optionalParams } : {},
    );
  }

  /**
   * Logs an error message
   */
  public error(message?: any, ...optionalParams: any[]) {
    const requestId = this.getRequestId();
    console.error(message, ...optionalParams);
    const caller = this.getCallerInfo();
    const error = new Error();
    const stack = error.stack
      ?.split('\n')
      .slice(2)
      .map((line) => line.trim())
      .join('\n');
    this.addLogToStorage(
      requestId,
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
    const requestId = this.getRequestId();
    console.info(message, ...optionalParams);
    const caller = this.getCallerInfo();
    this.addLogToStorage(
      requestId,
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
    const requestId = this.getRequestId();
    console.trace(message, ...optionalParams);
    const caller = this.getCallerInfo();
    const error = new Error();
    const stack = error.stack?.split('\n').slice(2).join('\n');
    this.addLogToStorage(
      requestId,
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

  /**
   * Retrieves information about the caller of the log method
   */
  private getCallerInfo(): CallerInfo {
    return getCallerInfo(new Error().stack);
  }
}
