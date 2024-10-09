import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from '~/resources/auth/auth.service';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    // if (!token) {
    //   throw new UnauthorizedException();
    // }
    // try {
    //   const payload = await this.authService.hydrate(token);
    //   request['user'] = payload;
    // } catch (e) {
    //   console.log(e);
    //   throw new UnauthorizedException();
    // }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] =
      (request.headers['x-api-key'] as string)?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
