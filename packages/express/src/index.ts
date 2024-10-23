import { NextFunction, Response } from 'express';
import { ExtendedRequest } from './types';
import { generateId, LogsTrapInitOptions } from '@logstrap/core';
import { LOGSTRAP_REQUEST_ID } from '@logstrap/constants';

function middleware(
  req: ExtendedRequest,
  response: Response,
  next: NextFunction,
) {
  const requestId = generateId();
  req[LOGSTRAP_REQUEST_ID] = requestId;
  const originalMethod = response.json;
  response.json = function (body) {
    return originalMethod.call(response, {
      ...body,
      [LOGSTRAP_REQUEST_ID]: requestId,
    });
  };
  next();
}

export function withLogstrap(options: LogsTrapInitOptions) {
  options;
  return {
    middleware,
  };
}
