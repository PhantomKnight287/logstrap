import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const Project = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.project;
  },
);
