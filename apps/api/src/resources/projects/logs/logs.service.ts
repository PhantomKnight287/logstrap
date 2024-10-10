import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import {
  CreateApplicationLogDto,
  CreateLogDto,
  RequestLogDTO,
} from './dto/create-log.dto';
import { UpdateLogDto } from './dto/update-log.dto';
import { db } from '~/db';
import {
  ApiKeys,
  applicationLogs as applicationLogsTable,
  projects,
  requestLogs as requestLogsTable,
} from '@logstrap/db';
import { and, desc, eq, getTableColumns, sql } from 'drizzle-orm';
import { ITEMS_PER_QUERY } from '~/constants';

@Injectable()
export class LogsService {
  protected logger = new Logger(LogsService.name);
  async create(body: CreateLogDto, apiKey: typeof ApiKeys.$inferSelect) {
    this.logger.log(`Creating logs for Project: ${apiKey.projectId}`);
    // Key is already validated by the guard
    if (body.requests) {
      await this.processRequests(body.requests, apiKey.projectId, apiKey.id);
    }

    return { message: 'Logged' };
  }

  private async processRequests(
    requests: any[],
    projectId: string,
    apiKeyId: string,
  ) {
    await db.transaction(async (tx) => {
      for (const request of requests) {
        const [baseApiRequest] = await this.insertRequestLog(
          tx,
          request,
          projectId,
          apiKeyId,
        );
        await this.insertApplicationLogs(
          tx,
          request.applicationLogs,
          projectId,
          apiKeyId,
          baseApiRequest.id,
        );
      }
    });
  }

  private async insertRequestLog(
    tx: any,
    request: RequestLogDTO,
    projectId: string,
    apiKeyId: string,
  ) {
    return tx
      .insert(requestLogsTable)
      .values({
        apiKeyId,
        method: request.method,
        projectId,
        url: request.url,
        statusCode: request.statusCode,
        requestBody: request.requestBody,
        requestHeaders: request.requestHeaders,
        responseBody: request.responseBody,
        responseHeaders: request.responseHeaders,
        cookies: request.cookies,
        ip: request.ip,
        userAgent: request.userAgent,
        timeTaken: request.timeTaken,
      })
      .returning();
  }

  private async insertApplicationLogs(
    tx: any,
    applicationLogs: CreateApplicationLogDto[],
    projectId: string,
    apiKeyId: string,
    requestId: string,
  ) {
    for (const log of applicationLogs) {
      await tx.insert(applicationLogsTable).values({
        apiKeyId,
        level: log.level,
        message: log.message,
        projectId,
        requestId,
        component: log.component,
        functionName: log.functionName,
        additionalInfo: log.additionalInfo,
      });
    }
  }

  async getRequestLogs(
    projectId: string,
    userId: string,
    page: number,
    limit: number,
  ) {
    this.logger.log(`Getting request logs for Project: ${projectId}`);
    const project = await db.query.projects.findFirst({
      where: and(eq(projects.id, projectId), eq(projects.userId, userId)),
    });
    if (!project) {
      this.logger.warn(`Project not found: ${projectId}`);
      throw new HttpException('No project found', HttpStatus.NOT_FOUND);
    }
    const {
      id,
      url,
      timestamp,
      userAgent,
      method,
      statusCode,
      apiKeyId,
      timeTaken,
      projectId: projectIdColumn,
    } = getTableColumns(requestLogsTable);
    const logs = await db
      .select({
        id,
        url,
        timestamp,
        userAgent,
        method,
        statusCode,
        apiKeyId,
        timeTaken,
        projectId: projectIdColumn,
        applicationLogsCount: sql`count(*)`
          .mapWith(Number)
          .as('applicationLogsCount'),
      })
      .from(requestLogsTable)
      .where(eq(requestLogsTable.projectId, projectId))
      .groupBy(requestLogsTable.id)
      .limit(limit ?? ITEMS_PER_QUERY)
      .offset(((page <= 0 ? 1 : page) - 1) * (limit ?? ITEMS_PER_QUERY))
      .orderBy(desc(requestLogsTable.timestamp));

    const [{ count }] = await db
      .select({ count: sql`count(*)`.mapWith(Number).as('count') })
      .from(requestLogsTable)
      .where(eq(requestLogsTable.projectId, projectId));

    return {
      items: logs,
      totalItems: count,
      itemsPerQuery: limit ?? ITEMS_PER_QUERY,
    };
  }

  findAll() {
    return `This action returns all logs`;
  }

  findOne(id: number) {
    return `This action returns a #${id} log`;
  }

  update(id: number, updateLogDto: UpdateLogDto) {
    return `This action updates a #${id} log`;
  }

  remove(id: number) {
    return `This action removes a #${id} log`;
  }
}
