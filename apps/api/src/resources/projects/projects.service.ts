import { Injectable, Logger } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { db } from '~/db';
import { projects as projectsModel } from '@logstrap/db';
import { eq, sql } from 'drizzle-orm';
import { ITEMS_PER_QUERY } from '~/constants';
import { plainToInstance } from 'class-transformer';
import { FetchAllProjectsResponse } from './entities/response.entity';
import { ProjectIdEntity } from './entities/project.entity';

@Injectable()
export class ProjectsService {
  protected logger = new Logger(ProjectsService.name);
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
    this.logger.log(`Searching for all projects for user: ${userId}`);

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
    this.logger.log(`Found ${count.count} projects for user: ${userId}`);

    return plainToInstance(FetchAllProjectsResponse, {
      items: projects,
      totalItems: count.count,
      itemsPerQuery: limit,
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} project`;
  }

  update(id: number, updateProjectDto: UpdateProjectDto) {
    return `This action updates a #${id} project`;
  }

  remove(id: number) {
    return `This action removes a #${id} project`;
  }
}
