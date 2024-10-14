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
import {
  requestLogs as requestLogsTable,
  ApiKeys,
  applicationLogs as applicationLogsTable,
} from '@logstrap/db';

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

  async getProjectApiRequestSearchFilters(id: string, userId: string) {
    this.logger.log(
      `Getting project api request search filters for project: ${id}`,
    );
    const project = await this.findOne(id, userId);
    const availableStatusCodes = await db
      .selectDistinct({
        statusCode: requestLogsTable.statusCode,
      })
      .from(requestLogsTable)
      .where(eq(requestLogsTable.projectId, id));

    const availableMethods = await db
      .selectDistinct({
        method: requestLogsTable.method,
      })
      .from(requestLogsTable)
      .where(eq(requestLogsTable.projectId, id));

    const availableApiKeys = await db.query.ApiKeys.findMany({
      where: eq(ApiKeys.projectId, id),
      columns: {
        id: true,
        name: true,
      },
    });

    return {
      statusCodes: availableStatusCodes
        .map((status) => status.statusCode)
        .filter(Boolean),
      methods: availableMethods.map((method) => method.method).filter(Boolean),
      apiKeys: availableApiKeys,
    };
  }

  async getProjectApplicationLogsSearchFilters(id: string, userId: string) {
    this.logger.log(
      `Getting application logs search filters for project: ${id}`,
    );
    const project = await this.findOne(id, userId);
    const logLevels = await db
      .selectDistinct({
        level: applicationLogsTable.level,
      })
      .from(applicationLogsTable)
      .where(eq(applicationLogsTable.projectId, id));

    const components = await db
      .selectDistinct({
        component: applicationLogsTable.component,
      })
      .from(applicationLogsTable)
      .where(eq(applicationLogsTable.projectId, id));

    const functionNames = await db
      .selectDistinct({
        functionName: applicationLogsTable.functionName,
      })
      .from(applicationLogsTable)
      .where(eq(applicationLogsTable.projectId, id));

    const availableApiKeys = await db.query.ApiKeys.findMany({
      where: eq(ApiKeys.projectId, id),
      columns: {
        id: true,
        name: true,
      },
    });

    return {
      logLevels: logLevels.map((level) => level.level).filter(Boolean),
      components: components
        .map((component) => component.component)
        .filter(Boolean),
      functionNames: functionNames.map((fn) => fn.functionName).filter(Boolean),
      apiKeys: availableApiKeys,
    };
  }

  update(id: number, updateProjectDto: UpdateProjectDto) {
    return `This action updates a #${id} project`;
  }

  remove(id: number) {
    return `This action removes a #${id} project`;
  }
}
