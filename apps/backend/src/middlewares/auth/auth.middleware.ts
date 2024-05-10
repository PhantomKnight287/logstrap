import { NextFunction, Request, Response } from 'express';

import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';

import { AuthService } from '../../resources/auth/auth.service';
import { User } from '@prisma/client';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly authService: AuthService) {}
  async use(
    req: Request & {
      auth: Partial<User>;
    },
    res: Response,
    next: NextFunction,
  ) {
    try {
      const token = req.headers.authorization;
      if (!token) throw Error();
      req.auth = await this.authService.verify(
        token.startsWith('Bearer ') ? token.replaceAll('Bearer ', '') : token,
      );
      next();
    } catch (e) {
      throw new HttpException(
        'Missing or Expired Token',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
