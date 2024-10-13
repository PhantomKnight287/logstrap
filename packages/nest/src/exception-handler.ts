import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  InternalServerErrorException,
} from '@nestjs/common';
import { LogsTrapRequest } from './types';
import { LOGSTRAP_REQUEST_ID } from '@logstrap/constants';
import { ClsService } from 'nestjs-cls';
import { Response } from 'express';

@Catch()
export class LogsTrapExceptionHandler implements ExceptionFilter {
  constructor(private readonly clsService: ClsService) {}
  catch(exception: Error, host: ArgumentsHost) {
    const req = host.switchToHttp().getRequest<LogsTrapRequest>();
    const res = host.switchToHttp().getResponse<Response>();
    const requestId = req[LOGSTRAP_REQUEST_ID];
    const existingLogs = this.clsService.get(requestId);
    const statusCode =
      exception instanceof HttpException ? exception.getStatus() : 500;

    if (statusCode === 500) {
      this.clsService.set(requestId, [
        ...existingLogs,
        {
          level: 'error',
          message: exception.message,
          additionalInfo: {
            stack: exception.stack,
          },
        },
      ]);
    }
    return res.status(statusCode).json({
      statusCode: statusCode,
      message: exception.message,
    });
  }
}
