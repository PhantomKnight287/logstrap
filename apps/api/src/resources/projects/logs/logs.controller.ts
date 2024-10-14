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
  ParseArrayPipe,
  HttpException,
  HttpStatus,
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
import {
  FetchApplicationLogsResponseEntity,
  FetchRequestLogsResponseEntity,
} from './entities/response.entity';
import {
  ApplicationLogEntity,
  ExtendedApplicationLogEntity,
  LogEntity,
} from './entities/log.entity';
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
  @ApiQuery({
    name: 'q',
    description: 'The search query',
    required: false,
    type: String,
  })
  @ApiQuery({
    name: 'apiKey',
    description: 'The api keys',
    required: false,
    type: [String],
  })
  @ApiQuery({
    name: 'fromDate',
    description: 'The from date',
    required: false,
    type: String,
  })
  @ApiQuery({
    name: 'toDate',
    description: 'The to date',
    required: false,
    type: String,
  })
  @ApiQuery({
    name: 'method',
    description: 'The method',
    required: false,
    type: [String],
  })
  @ApiQuery({
    name: 'statusCode',
    description: 'The status code',
    required: false,
    type: [String],
  })
  async getRequestLogs(
    @Param('id') id: string,
    @User() user: UserEntity,
    @Query('page', ParseIntPipe) page: number,
    @Query('limit') limit?: string,
    @Query('q') q?: string,
    @Query('apiKey') apiKey?: string[],
    @Query('fromDate') fromDate?: string,
    @Query('toDate') toDate?: string,
    @Query('method') method?: string[],
    @Query('statusCode') statusCode?: string[],
  ) {
    const filters = {
      q,
      apiKey,
      fromDate,
      toDate,
      method,
      statusCode,
    };
    if (filters.apiKey && !Array.isArray(filters.apiKey)) {
      if (typeof filters.apiKey === 'string') {
        filters.apiKey = [filters.apiKey];
      } else
        throw new HttpException(
          'Api keys must be an array in query params',
          HttpStatus.BAD_REQUEST,
        );
    }
    if (filters.statusCode && !Array.isArray(filters.statusCode)) {
      if (typeof filters.statusCode === 'string') {
        filters.statusCode = [filters.statusCode];
      } else
        throw new HttpException(
          'Status codes must be an array in query params',
          HttpStatus.BAD_REQUEST,
        );
    }
    if (filters.method && !Array.isArray(filters.method)) {
      if (typeof filters.method === 'string') {
        filters.method = [filters.method];
      } else
        throw new HttpException(
          'Methods must be an array in query params',
          HttpStatus.BAD_REQUEST,
        );
    }

    return this.logsService.getRequestLogs(
      id,
      user.id,
      page,
      limit
        ? Number.isNaN(+limit)
          ? ITEMS_PER_QUERY
          : +limit
        : ITEMS_PER_QUERY,
      filters,
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

  @Get('application-logs')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Get application logs for a project',
    description: 'Get application logs for a project',
  })
  @ApiOkResponse({
    type: FetchApplicationLogsResponseEntity,
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
  @ApiQuery({
    name: 'q',
    description: 'The search query',
    required: false,
    type: String,
  })
  @ApiQuery({
    name: 'fromDate',
    description: 'The from date',
    required: false,
    type: String,
  })
  @ApiQuery({
    name: 'toDate',
    description: 'The to date',
    required: false,
    type: String,
  })
  @ApiQuery({
    name: 'level',
    description: 'The level',
    required: false,
    type: [String],
  })
  @ApiQuery({
    name: 'apiKey',
    description: 'The api keys',
    required: false,
    type: [String],
  })
  @ApiQuery({
    name: 'component',
    description: 'The component',
    required: false,
    type: [String],
  })
  @ApiQuery({
    name: 'functionName',
    description: 'The function name',
    required: false,
    type: [String],
  })
  async getApplicationLogs(
    @Param('id') id: string,
    @User() user: UserEntity,
    @Query('page', ParseIntPipe) page: number,
    @Query('limit') limit?: string,
    @Query('q') q?: string,
    @Query('fromDate') fromDate?: string,
    @Query('toDate') toDate?: string,
    @Query('level') level?: string[],
    @Query('apiKey') apiKey?: string[],
    @Query('component') component?: string[],
    @Query('functionName') functionName?: string[],
  ) {
    const filters = {
      q,
      fromDate,
      toDate,
      level,
      apiKey,
      component,
      functionName,
    };
    if (filters.level && !Array.isArray(filters.level)) {
      if (typeof filters.level === 'string') {
        filters.level = [filters.level];
      } else
        throw new HttpException(
          'Levels must be an array in query params',
          HttpStatus.BAD_REQUEST,
        );
    }
    if (filters.apiKey && !Array.isArray(filters.apiKey)) {
      if (typeof filters.apiKey === 'string') {
        filters.apiKey = [filters.apiKey];
      } else
        throw new HttpException(
          'Api keys must be an array in query params',
          HttpStatus.BAD_REQUEST,
        );
    }
    if (filters.component && !Array.isArray(filters.component)) {
      if (typeof filters.component === 'string') {
        filters.component = [filters.component];
      } else
        throw new HttpException(
          'Components must be an array in query params',
          HttpStatus.BAD_REQUEST,
        );
    }
    if (filters.functionName && !Array.isArray(filters.functionName)) {
      if (typeof filters.functionName === 'string') {
        filters.functionName = [filters.functionName];
      } else
        throw new HttpException(
          'Function names must be an array in query params',
          HttpStatus.BAD_REQUEST,
        );
    }

    return this.logsService.getApplicationLogs(
      id,
      user.id,
      page,
      limit
        ? Number.isNaN(+limit)
          ? ITEMS_PER_QUERY
          : +limit
        : ITEMS_PER_QUERY,
      filters,
    );
  }

  @Get('application-logs/:logId')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Get an application log by id',
    description: 'Get an application log by id',
  })
  @ApiOkResponse({
    type: ExtendedApplicationLogEntity,
  })
  @ApiNotFoundResponse({
    type: GenericErrorEntity,
    description: 'Log or Project not found',
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Id of project',
  })
  @ApiParam({
    name: 'logId',
    required: true,
    description: 'Id of log',
  })
  async getApplicationLog(
    @Param('id') id: string,
    @User() user: UserEntity,
    @Param('logId') logId: string,
  ) {
    return this.logsService.getApplicationLog(logId, id, user.id);
  }
}
