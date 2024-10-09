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
import { LogsService } from './logs.service';
import { CreateLogDto } from './dto/create-log.dto';
import { UpdateLogDto } from './dto/update-log.dto';
import { ApiOperation, ApiParam, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { ApiKeyGuard } from '~/guards/api-key/api-key.guard';
import { ApiKey } from '~/decorators/api-key/api-key.decorator';

@Controller('projects/:id/logs')
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
  @Post()
  @ApiOperation({
    description: 'Create logs',
    summary: 'Create Logs',
  })
  create(
    @Body() createLogDto: CreateLogDto,
    @ApiKey() apiKey: string,
    @Param('id') projectId: string,
  ) {
    return this.logsService.create(createLogDto, projectId, apiKey);
  }

  @Get()
  findAll() {
    return this.logsService.findAll();
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
