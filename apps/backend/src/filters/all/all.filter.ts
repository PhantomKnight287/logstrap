import { Request, Response } from 'express';
import { IncomingMessage } from 'http';

import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

import { errorSubject$ } from '../../constants';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const req = host.getArgs()[0];

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const message =
      exception instanceof HttpException
        ? exception.message
        : 'Internal server error';
    const detailedError =
      exception instanceof Error
        ? exception.message
        : 'Unexpected error occurred';

    const errorMessage = {
      statusCode: status,
      message,
      detailedError,
      timestamp: new Date().toISOString(),
      path: request.originalUrl,
    };

    if (req instanceof IncomingMessage) {
      errorSubject$.next({
        statusCode: status,
        path: request.originalUrl,
        message: exception.message,
        requestHeaders: request.headers,
        requestBody: JSON.stringify(request.body),
        responseHeader: response.getHeaders(),
        responseBody: JSON.stringify(errorMessage),
        stackTrace: exception.stack,
        method: request.method,
        name: exception.name,
      });
    }

    response.status(status).json(errorMessage);
  }
}
