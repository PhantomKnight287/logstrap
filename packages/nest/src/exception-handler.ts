import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Inject,
} from '@nestjs/common';
import { LogsTrapRequest } from './types';
import { LOGSTRAP_REQUEST_ID } from '@logstrap/constants';
import { ClsService } from 'nestjs-cls';
import { Response } from 'express';
import type { LogsTrapInitOptions } from './types';
import { DEFAULT_ERROR_STATUS_CODES, LOGSTRAP_OPTIONS } from './constants';
import { getCallerInfo } from './utils';

@Catch()
export class LogsTrapExceptionHandler implements ExceptionFilter {
  constructor(
    private readonly clsService: ClsService,
    @Inject(LOGSTRAP_OPTIONS) private readonly options: LogsTrapInitOptions,
  ) {}
  catch(exception: Error, host: ArgumentsHost) {
    const req = host.switchToHttp().getRequest<LogsTrapRequest>();
    const res = host.switchToHttp().getResponse<Response>();
    const requestId = req[LOGSTRAP_REQUEST_ID];
    const existingLogs = this.clsService.get(requestId);
    const statusCode =
      exception instanceof HttpException ? exception.getStatus() : 500;
    const errorStatusCodes =
      this.options.errorStatusCodes ?? DEFAULT_ERROR_STATUS_CODES;
    if (errorStatusCodes.includes(statusCode)) {
      const callerInfo = getCallerInfo(exception.stack);
      this.clsService.set(requestId, [
        ...existingLogs,
        {
          level: 'error',
          message: exception.message,
          additionalInfo: {
            stack: exception.stack,
          },
          functionName: callerInfo.functionName,
          component: callerInfo.className,
        },
      ]);
    }
    return res.status(statusCode).json({
      statusCode: statusCode,
      message: exception.message,
    });
  }
}
