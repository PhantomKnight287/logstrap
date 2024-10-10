import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { KeysService } from '~/resources/projects/keys/keys.service';
import { LOGSTRAP_API_KEY } from '@logstrap/constants';
@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private keysService: KeysService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const key = this.extractTokenFromHeader(request);
    if (!key) {
      throw new UnauthorizedException(
        'No API key provided. Please provide an API key to continue.',
      );
    }
    const projectId = request.params.id;
    if (!projectId) {
      throw new BadRequestException('No projectId provided.');
    }
    const apiKey = await this.keysService.verify(projectId, key);
    request['apiKey'] = apiKey;
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const token = request.headers[LOGSTRAP_API_KEY] as string;
    return token;
  }
}
