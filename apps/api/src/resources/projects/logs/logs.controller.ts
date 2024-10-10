import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  ParseIntPipe,
  Res,
} from '@nestjs/common';
import { LogsService } from './logs.service';
import { CreateLogDto } from './dto/create-log.dto';
import { UpdateLogDto } from './dto/update-log.dto';
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { ApiKeyGuard } from '~/guards/api-key/api-key.guard';
import { ApiKey } from '~/decorators/api-key/api-key.decorator';
import { ApiKeys } from '@logstrap/db';
import { AuthGuard } from '~/guards/auth/auth.guard';
import { User } from '~/decorators/user/user.decorator';
import { UserEntity } from '~/resources/auth/entities/auth.entity';
import { ITEMS_PER_QUERY } from '~/constants';
import { FetchRequestLogsResponseEntity } from './entities/response.entity';
import { LogEntity } from './entities/log.entity';
import { GenericErrorEntity } from '~/entity';
@Controller('projects/:id')
@ApiTags('Logs')
@ApiParam({
  name: 'id',
  required: true,
  description: 'Id of project',
})
export class LogsController {
  constructor(private readonly logsService: LogsService) {}

  @UseGuards(ApiKeyGuard)
  @ApiSecurity('Api-Key')
  @Post('logs')
  @ApiOperation({
    description: 'Create logs',
    summary: 'Create Logs',
  })
  create(
    @Body() createLogDto: CreateLogDto,
    @ApiKey() apiKey: typeof ApiKeys.$inferSelect,
  ) {
    return this.logsService.create(createLogDto, apiKey);
  }

  @UseGuards(AuthGuard)
  @Get('request-logs')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Get requests logs for a project',
    description: 'Get requests logs for a project',
  })
  @ApiOkResponse({
    type: FetchRequestLogsResponseEntity,
  })
  @ApiQuery({
    name: 'page',
    description: 'The no of page',
    type: String,
    required: true,
  })
  @ApiQuery({
    name: 'limit',
    description: `The no of items to fetch, defaults to ${ITEMS_PER_QUERY}`,
    required: false,
    type: String,
  })
  async getRequestLogs(
    @Param('id') id: string,
    @User() user: UserEntity,
    @Query('page', ParseIntPipe) page: number,

    @Query('limit') limit?: string,
  ) {
    return this.logsService.getRequestLogs(
      id,
      user.id,
      page,
      limit
        ? Number.isNaN(+limit)
          ? ITEMS_PER_QUERY
          : +limit
        : ITEMS_PER_QUERY,
    );
  }

  @Get('request-logs/:logId')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Get a request log by id',
    description: 'Get a request log by id',
  })
  @ApiOkResponse({
    type: LogEntity,
  })
  @ApiNotFoundResponse({
    type: GenericErrorEntity,
    description: 'Log or Project not found',
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Id of request log',
  })
  async getRequestLog(
    @Param('id') projectId: string,
    @User() user: UserEntity,
    @Param('logId') logId: string,
  ) {
    return this.logsService.getApiRequestLog(logId, projectId, user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.logsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLogDto: UpdateLogDto) {
    return this.logsService.update(+id, updateLogDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.logsService.remove(+id);
  }
}
