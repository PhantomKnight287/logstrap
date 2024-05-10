import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDTO } from './dto/create-project.dto';
import { Auth } from 'src/decorators/auth/auth.decorator';
import { User } from '@prisma/client';

@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  createProject(@Body() body: CreateProjectDTO, @Auth() auth: Partial<User>) {
    return this.projectService.createProject(body, auth.id);
  }

  @Get()
  listProjects(@Auth() auth: Partial<User>) {
    return this.projectService.listProjects(auth.id);
  }
  @Patch(':id')
  updateProject(
    @Body() body: CreateProjectDTO,
    @Auth() auth: Partial<User>,
    @Param('id') projectId: string,
  ) {
    return this.projectService.updateProject(body, projectId, auth.id);
  }
}
