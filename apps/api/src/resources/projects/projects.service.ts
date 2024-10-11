import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { db } from '~/db';
import { projects as projectsModel } from '@logstrap/db';
import { and, eq, sql } from 'drizzle-orm';
import { ITEMS_PER_QUERY } from '~/constants';
import { plainToInstance } from 'class-transformer';
import { FetchAllProjectsResponse } from './entities/response.entity';
import { Project, ProjectIdEntity } from './entities/project.entity';
import { LogsTrapService } from '@logstrap/nest';

@Injectable()
export class ProjectsService {
  constructor(private readonly logger: LogsTrapService) {}

  async create(body: CreateProjectDto, userId: string) {
    this.logger.log(`Creating project with name ${body.name}`);
    const [project] = await db
      .insert(projectsModel)
      //@ts-expect-error https://github.com/drizzle-team/drizzle-orm/issues/2654
      .values({
        name: body.name,
        userId,
        url: body.url,
        description: body.description,
      })
      .returning();
    return plainToInstance(ProjectIdEntity, project);
  }

  async findAll(userId: string, page: number, limit: number) {
    this.logger.info(`Searching for all projects for user: ${userId}`);

    const projects = await db.query.projects.findMany({
      where: eq(projectsModel.userId, userId),
      orderBy(fields, operators) {
        return [operators.desc(fields.createdAt)];
      },
      limit,
      offset: (page - 1) * ITEMS_PER_QUERY,
    });

    const [count] = await db
      .select({
        count: sql`count(*)`.mapWith(Number).as('count'),
      })
      .from(projectsModel)
      .where(eq(projectsModel.userId, userId));
    this.logger.error(`Found ${count.count} projects for user: ${userId}`);

    return plainToInstance(FetchAllProjectsResponse, {
      items: projects,
      totalItems: count.count,
      itemsPerQuery: limit,
    });
  }

  async findOne(id: string, userId: string) {
    this.logger.log(`Finding project with id: ${id}`);
    const project = await db.query.projects.findFirst({
      where: and(eq(projectsModel.id, id), eq(projectsModel.userId, userId)),
    });
    if (!project) {
      this.logger.warn(`No project found with id: ${id}`);
      throw new HttpException('No project found', HttpStatus.NOT_FOUND);
    }
    this.logger.log(`Found project with id: ${id}`);
    return plainToInstance(Project, project);
  }

  update(id: number, updateProjectDto: UpdateProjectDto) {
    return `This action updates a #${id} project`;
  }

  remove(id: number) {
    return `This action removes a #${id} project`;
  }
}
