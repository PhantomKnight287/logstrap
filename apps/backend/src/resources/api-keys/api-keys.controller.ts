import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiKeysService } from './api-keys.service';
import { CreateApiKeyDTO } from './dto/create-key.dto';
import { Auth } from 'src/decorators/auth/auth.decorator';
import { User } from '@prisma/client';

@Controller('api-keys')
export class ApiKeysController {
  constructor(private readonly apiKeysService: ApiKeysService) {}

  @Post(':projectId')
  createApiKey(
    @Body() body: CreateApiKeyDTO,
    @Auth() auth: Partial<User>,
    @Param('projectId') projectId: string,
  ) {
    return this.apiKeysService.createKey(body, projectId, auth.id);
  }

  @Get(':projectId')
  getApiKeys(
    @Auth() auth: Partial<User>,
    @Param('projectId') projectId: string,
  ) {
    return this.apiKeysService.listKeys(projectId, auth.id);
  }
}
