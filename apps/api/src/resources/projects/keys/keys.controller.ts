import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { KeysService } from './keys.service';
import { CreateKeyDto } from './dto/create-key.dto';
import { UpdateKeyDto } from './dto/update-key.dto';
import {
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
  CreateKeyResponse,
  FetchAllKeysResponse,
  FetchKeyResponse,
} from './entities/response.entity';
import { User } from '~/decorators/user/user.decorator';
import { UserEntity } from '~/resources/auth/entities/auth.entity';
import { GenericErrorEntity } from '~/entity';
import { AuthGuard } from '~/guards/auth/auth.guard';
import { VerifyKeyDto } from './dto/verify-key.dto';
import { VerifyKeyEntity } from './entities/verify-key.entity';

@ApiParam({
  name: 'id',
  description: 'Id of the project',
  required: true,
})
@Controller('projects/:id/keys')
@ApiTags('Keys')
@UseGuards(AuthGuard)
export class KeysController {
  constructor(private readonly keysService: KeysService) {}

  @Post()
  @ApiCreatedResponse({ type: CreateKeyResponse })
  @ApiNotFoundResponse({
    type: GenericErrorEntity,
    description: 'No project found',
  })
  @ApiOperation({
    description: 'Create a new API Key',
    summary: 'Create a new API key',
  })
  @ApiForbiddenResponse({
    type: GenericErrorEntity,
    description: "Tried creating a 'live' key without verified email",
  })
  create(
    @Body() createKeyDto: CreateKeyDto,
    @Param('id') id: string,
    @User() user: UserEntity,
  ) {
    return this.keysService.create(createKeyDto, id, user.id);
  }

  @Get()
  @ApiOkResponse({
    type: FetchAllKeysResponse,
  })
  @ApiOperation({
    description: 'Fetch all keys related to project',
    summary: 'Fetch all keys related to project',
  })
  findAll(@Param('id') id: string, @User() user: UserEntity) {
    return this.keysService.findAll(id, user.id);
  }

  @Get(':keyId')
  @ApiOperation({
    description: 'Fetch a key by id',
    summary: 'Fetch a key by id',
  })
  @ApiParam({
    name: 'keyId',
    description: 'Id of the key',
    required: true,
  })
  @ApiOkResponse({
    type: FetchKeyResponse,
  })
  @ApiNotFoundResponse({
    type: GenericErrorEntity,
    description: 'No key found',
  })
  findOne(
    @Param('id') id: string,
    @Param('keyId') keyId: string,
    @User() user: UserEntity,
  ) {
    return this.keysService.findOne(id, user.id, keyId);
  }

  @Post('verify')
  @ApiOperation({
    description: 'Verify a key',
    summary: 'Verify a key',
  })
  @ApiOkResponse({
    type: VerifyKeyEntity,
  })
  @ApiNotFoundResponse({
    type: GenericErrorEntity,
    description:
      'Either this API Key does not belong to this project or is incorrect.',
  })
  @ApiUnauthorizedResponse({
    type: GenericErrorEntity,
    description: 'Invalid API Key',
  })
  verifyKey(@Body() body: VerifyKeyDto, @Param('id') id: string) {
    return this.keysService.isKeyCorrect(id, body);
  }
}
