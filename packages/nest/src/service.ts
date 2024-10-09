import { LogsTrapInitOptions, logApiRequest } from '@logstrap/core';
import { Injectable, Scope, Inject } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';

import type { LogsTrapRequest } from './types';
import { ClsService } from 'nestjs-cls';
interface CallerInfo {
  className: string;
  functionName: string;
}
@Injectable({ scope: Scope.REQUEST })
export class LogsTrapService {
  constructor(
    @Inject(REQUEST) private readonly request: LogsTrapRequest,
    @Inject('LOGSTRAP_OPTIONS') private readonly options: LogsTrapInitOptions,
    private readonly cls: ClsService,
  ) {}

  private getId(): string {
    return this.request['x-logstrap-id'];
  }

  private addToStorage(
    id: string,
    logLevel: string,
    callerName: string,
    component: string | null,
    data: any,
    ...additionalInfo: any[]
  ) {
    const olderRecord = this.cls.get(id);
    const newRecord = {
      timestamp: new Date(),
      level: logLevel,
      message: typeof data === 'string' ? data : JSON.stringify(data),
      functionName: callerName,
      component,
      ...additionalInfo,
    };
    if (olderRecord) {
      this.cls.set(id, [...olderRecord, newRecord]);
    } else {
      this.cls.set(id, [newRecord]);
    }
  }

  public warn(message?: any, ...optionalParams: any[]) {
    const id = this.getId();
    console.warn(message, ...optionalParams);
    const caller = this.getCallerInfo();
    this.addToStorage(
      id,
      'warn',
      caller.functionName,
      caller.className,
      message,
      ...optionalParams,
    );
  }
  public log(message?: any, ...optionalParams: any[]) {
    const id = this.getId();
    const caller = this.getCallerInfo();
    this.addToStorage(
      id,
      'log',
      caller.functionName,
      caller.className,
      message,
      ...optionalParams,
    );
  }
  public error(message?: any, ...optionalParams: any[]) {
    const id = this.getId();
    console.error(message, ...optionalParams);
    const caller = this.getCallerInfo();
    this.addToStorage(
      id,
      'error',
      caller.functionName,
      caller.className,
      message,
      ...optionalParams,
    );
  }
  public info(message?: any, ...optionalParams: any[]) {
    const id = this.getId();
    console.info(message, ...optionalParams);
    const caller = this.getCallerInfo();
    this.addToStorage(
      id,
      'info',
      caller.functionName,
      caller.className,
      message,
      ...optionalParams,
    );
  }

  public trace(message?: any, ...optionalParams: any[]) {
    const id = this.getId();
    console.trace(message, ...optionalParams);
    const caller = this.getCallerInfo();
    this.addToStorage(
      id,
      'trace',
      caller.functionName,
      caller.className,
      message,
      ...optionalParams,
    );
  }
  private getCallerInfo(): CallerInfo {
    const err = new Error();
    const stack = err.stack?.split('\n');
    // The 3rd line of the stack trace should contain the caller's info
    const callerLine = stack?.[3];

    let className = 'Unknown';
    let functionName = 'Unknown';

    if (callerLine) {
      // Match for "at ClassName.methodName" pattern
      const classMatch = callerLine.match(/at\s+([\w.]+)\s*\./);
      if (classMatch && classMatch[1]) {
        className = classMatch[1];
      }

      // Match for method name
      const methodMatch = callerLine.match(/\.(\w+)\s*[\(<]/);
      if (methodMatch && methodMatch[1]) {
        functionName = methodMatch[1];
      } else {
        // If no method name found, it might be a function outside a class
        const funcMatch = callerLine.match(/at\s+(\w+)\s*[\(<]/);
        if (funcMatch && funcMatch[1]) {
          functionName = funcMatch[1];
          className = undefined;
        }
      }
    }

    return { className, functionName };
  }
}
