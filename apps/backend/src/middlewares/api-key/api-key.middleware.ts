import { NextFunction, Request, Response } from 'express';

import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';

import { ApiKeysService } from '../../resources/api-keys/api-keys.service';
import { Project } from '@prisma/client';

@Injectable()
export class ApiKeyMiddleware implements NestMiddleware {
  constructor(private readonly authService: ApiKeysService) {}
  async use(
    req: Request & {
      project: Partial<Project> & {
        key: string;
      };
    },
    res: Response,
    next: NextFunction,
  ) {
    try {
      const token = req.headers['x-api-key'];
      if (!token) throw Error();
      req.project = await this.authService.verifyKey(token as string);
      next();
    } catch (e) {
      throw new HttpException(
        'Missing or Invalid API Key',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
