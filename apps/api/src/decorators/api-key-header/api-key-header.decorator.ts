import { LOGSTRAP_API_KEY } from '@logstrap/constants';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IncomingMessage } from 'http';

export const ApiKeyHeader = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<IncomingMessage>();
    return request.headers[LOGSTRAP_API_KEY];
  },
);
