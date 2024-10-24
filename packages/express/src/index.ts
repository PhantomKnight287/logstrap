import { NextFunction, Response } from 'express';
import { ExtendedRequest } from './types';
import { generateId, LogsTrapInitOptions } from '@logstrap/core';
import { LOGSTRAP_REQUEST_ID } from '@logstrap/constants';
import { context } from './storage';
import { Logger } from './logger';

function middleware(
  req: ExtendedRequest,
  response: Response,
  next: NextFunction,
) {
  const logsStore = [];
  const requestId = generateId();
  req[LOGSTRAP_REQUEST_ID] = requestId;
  context.run(logsStore, () => {
    const originalMethod = response.json;
    response.json = function (body) {
      console.log(logsStore);
      return originalMethod.call(response, body);
    };
    next();
  });
}

export function withLogstrap(options: LogsTrapInitOptions) {
  options;
  return {
    middleware,
    logger: new Logger(),
  };
}
