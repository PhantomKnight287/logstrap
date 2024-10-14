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
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { AuthGuard } from '~/guards/auth/auth.guard';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { User } from '~/decorators/user/user.decorator';
import { UserEntity } from '../auth/entities/auth.entity';
import { ITEMS_PER_QUERY } from '~/constants';
import { FetchAllProjectsResponse } from './entities/response.entity';
import { Project, ProjectIdEntity } from './entities/project.entity';
import { GenericErrorEntity } from '~/entity';
import {
  ProjectApiRequestSearchFiltersResponse,
  ProjectApplicationLogsSearchFiltersResponse,
} from './logs/entities/response.entity';

@Controller('projects')
@UseGuards(AuthGuard)
@ApiBearerAuth('JWT-auth')
@ApiTags('Projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @ApiOperation({
    description: 'Create new project',
    summary: 'Create new project',
  })
  @ApiCreatedResponse({ type: ProjectIdEntity })
  create(@Body() createProjectDto: CreateProjectDto, @User() user: UserEntity) {
    return this.projectsService.create(createProjectDto, user.id);
  }

  @Get()
  @ApiOperation({
    description: 'Fetch all projects',
    summary: 'Fetch all projects',
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
  @ApiOkResponse({
    type: FetchAllProjectsResponse,
  })
  findAll(
    @User() user: UserEntity,
    @Query('page', ParseIntPipe) page: number,
    @Query('limit') limit?: number,
  ) {
    limit = +limit;
    return this.projectsService.findAll(
      user.id,
      page,
      Number.isNaN(limit) ? ITEMS_PER_QUERY : limit,
    );
  }

  @Get(':id')
  @ApiOperation({
    description: 'Find a project with id',
    summary: 'Find a project with id',
  })
  @ApiOkResponse({ type: Project, description: 'Project found' })
  @ApiNotFoundResponse({
    type: GenericErrorEntity,
    description: 'Project not found',
  })
  @ApiParam({
    type: String,
    required: true,
    name: 'id',
    description: 'The id of the project',
  })
  findOne(@Param('id') id: string, @User() user: UserEntity) {
    return this.projectsService.findOne(id, user.id);
  }

  @ApiOperation({
    description: 'Get project api request search filters',
    summary: 'Get project api request search filters',
  })
  @ApiParam({
    type: String,
    required: true,
    name: 'id',
    description: 'The id of the project',
  })
  @ApiOkResponse({
    type: ProjectApiRequestSearchFiltersResponse,
  })
  @Get(':id/api-request-search-filters')
  getProjectApiRequestSearchFilters(
    @Param('id') id: string,
    @User() user: UserEntity,
  ) {
    return this.projectsService.getProjectApiRequestSearchFilters(id, user.id);
  }

  @ApiOperation({
    description: 'Get project application logs search filters',
    summary: 'Get project application logs search filters',
  })
  @ApiParam({
    type: String,
    required: true,
    name: 'id',
    description: 'The id of the project',
  })
  @ApiOkResponse({
    type: ProjectApplicationLogsSearchFiltersResponse,
  })
  @Get(':id/application-logs-search-filters')
  getProjectApplicationLogsSearchFilters(
    @Param('id') id: string,
    @User() user: UserEntity,
  ) {
    return this.projectsService.getProjectApplicationLogsSearchFilters(
      id,
      user.id,
    );
  }
}
