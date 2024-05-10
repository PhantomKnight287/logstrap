import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { LogsService } from './logs.service';
import { CreateLogDTO } from './dto/create-log.dto';
import { Project } from 'src/decorators/api-key/api-key.decorator';
import { Auth } from 'src/decorators/auth/auth.decorator';
import { User } from '@prisma/client';

@Controller('logs')
export class LogsController {
  constructor(private readonly logsService: LogsService) {}

  @Post()
  async createLog(@Body() body: CreateLogDTO, @Project() project) {
    return await this.logsService.createLog(body, project.id, project.key);
  }

  @Get(':projectId')
  listLogs(
    @Auth() auth: Partial<User>,
    @Param('projectId') projectId: string,
    @Query('skip') skip?: string,
    @Query('take') take?: string,
  ) {
    return this.logsService.listLogs(
      auth.id,
      projectId,
      Number.isNaN(parseInt(skip)) ? undefined : parseInt(skip),
      Number.isNaN(parseInt(take)) ? undefined : parseInt(take),
    );
  }

  @Get(':projectId/:logId')
  getLog(
    @Auth() auth: Partial<User>,
    @Param('projectId') projectId: string,
    @Param('logId') logId: string,
  ) {
    return this.logsService.getLogInfo(auth.id, projectId, logId);
  }
}
