import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IncomingMessage } from 'http';

export const ApiKey = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<IncomingMessage>();
    return request['apiKey'];
  },
);
