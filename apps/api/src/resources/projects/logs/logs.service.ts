import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import {
  CreateApplicationLogDto,
  CreateLogDto,
  RequestLogDTO,
} from './dto/create-log.dto';
import { db } from '~/db';
import {
  ApiKeys,
  applicationLogs as applicationLogsTable,
  LogLevelEnum,
  projects,
  requestLogs as requestLogsTable,
  systemLogs,
} from '@logstrap/db';
import {
  and,
  desc,
  eq,
  getTableColumns,
  gte,
  ilike,
  inArray,
  lte,
  sql,
} from 'drizzle-orm';
import { ITEMS_PER_QUERY } from '~/constants';
import { Cron, CronExpression } from '@nestjs/schedule';
import { sub } from 'date-fns';
import { StandaloneLogsTrapService } from '@logstrap/nest';
import { getKeyFromPrefixedKey } from '~/utils';
import { EncryptionService } from '~/services/encryption/encryption.service';
import { randomBytes } from 'crypto';

type Filters = {
  q?: string;
  apiKey?: string[];
  fromDate?: string;
  toDate?: string;
  method?: string[];
  statusCode?: string[];
};

type ApplicationLogFilters = {
  level?: string[];
  q?: string;
  fromDate?: string;
  toDate?: string;
  apiKey?: string[];
  component?: string[];
  functionName?: string[];
};

@Injectable()
export class LogsService {
  private logger = new Logger(LogsService.name);
  constructor(
    private readonly standaloneLogsTrapService: StandaloneLogsTrapService,
    private readonly encryptionService: EncryptionService,
  ) {}
  async create(
    body: CreateLogDto,
    apiKeyRecord: typeof ApiKeys.$inferSelect,
    apiKeyHeader: string,
  ) {
    this.logger.log(`Creating logs for Project: ${apiKeyRecord.projectId}`);
    const apiKey = getKeyFromPrefixedKey(apiKeyHeader);
    if (body.requests) {
      await this.processRequests(
        body.requests,
        apiKeyRecord.projectId,
        apiKeyRecord.id,
        apiKey,
      );
    }
    if (body.applicationLogs) {
      await this.processApplicationLogs(
        body.applicationLogs,
        apiKeyRecord.projectId,
        apiKeyRecord.id,
        apiKey,
      );
    }

    return { message: 'Logged' };
  }

  private async processRequests(
    requests: any[],
    projectId: string,
    apiKeyId: string,
    apiKey: string,
  ) {
    await db.transaction(async (tx) => {
      for (const request of requests) {
        const [baseApiRequest] = await this.insertRequestLog(
          tx,
          request,
          projectId,
          apiKeyId,
          apiKey,
        );
        if (Array.isArray(request.applicationLogs)) {
          await this.insertApplicationLogs(
            tx,
            request.applicationLogs,
            projectId,
            apiKeyId,
            apiKey,
            baseApiRequest.id,
          );
        }
      }
    });
  }

  private async processApplicationLogs(
    applicationLogs: CreateApplicationLogDto[],
    projectId: string,
    apiKeyId: string,
    apiKey: string,
  ) {
    await db.transaction(async (tx) => {
      await this.insertApplicationLogs(
        tx,
        applicationLogs,
        projectId,
        apiKeyId,
        apiKey,
        undefined,
      );
    });
  }

  private async insertRequestLog(
    tx: any,
    request: RequestLogDTO,
    projectId: string,
    apiKeyId: string,
    apiKey: string,
  ) {
    const iv = randomBytes(16);

    return tx
      .insert(requestLogsTable)
      .values({
        apiKeyId,
        method: request.method,
        projectId,
        url: request.url,
        statusCode: request.statusCode,
        requestBody: (
          await this.encryptionService.encrypt(
            JSON.stringify(request.requestBody ?? {}),
            apiKey,
            iv,
          )
        ).encryptedData,
        requestHeaders: (
          await this.encryptionService.encrypt(
            JSON.stringify(request.requestHeaders ?? {}),
            apiKey,
            iv,
          )
        ).encryptedData,
        responseBody: (
          await this.encryptionService.encrypt(
            JSON.stringify(request.responseBody ?? {}),
            apiKey,
            iv,
          )
        ).encryptedData,
        responseHeaders: (
          await this.encryptionService.encrypt(
            JSON.stringify(request.responseHeaders ?? {}),
            apiKey,
            iv,
          )
        ).encryptedData,
        cookies: (
          await this.encryptionService.encrypt(
            JSON.stringify(request.cookies ?? {}),
            apiKey,
            iv,
          )
        ).encryptedData,
        ip: (await this.encryptionService.encrypt(request.ip ?? '', apiKey, iv))
          .encryptedData,
        userAgent: request.userAgent,
        timeTaken: request.timeTaken,
        host: request.host,
        iv: iv.toString('hex'),
      })
      .returning();
  }

  private async insertApplicationLogs(
    tx: any,
    applicationLogs: CreateApplicationLogDto[],
    projectId: string,
    apiKeyId: string,
    apiKey: string,
    requestId: string | undefined,
  ) {
    const iv = randomBytes(16);
    for (const log of applicationLogs) {
      await tx.insert(applicationLogsTable).values({
        apiKeyId,
        iv: iv.toString('hex'),
        level: log.level,
        message: log.message,
        projectId,
        requestId,
        component: log.component,
        functionName: log.functionName,
        additionalInfo: log.additionalInfo
          ? (
              await this.encryptionService.encrypt(
                JSON.stringify(log.additionalInfo ?? {}),
                apiKey,
                iv,
              )
            ).encryptedData
          : null,
      });
    }
  }

  async getRequestLogs(
    projectId: string,
    userId: string,
    page: number,
    limit: number,
    filters?: Filters,
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
      host,
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
        host,
        projectId: projectIdColumn,
        apiKeyName: ApiKeys.name,
        applicationLogsCount: sql`count(*)`
          .mapWith(Number)
          .as('applicationLogsCount'),
      })
      .from(requestLogsTable)
      .where(
        and(
          eq(requestLogsTable.projectId, projectId),
          ...[
            filters?.apiKey &&
              inArray(requestLogsTable.apiKeyId, filters.apiKey),
            filters?.statusCode &&
              inArray(requestLogsTable.statusCode, filters.statusCode),
            filters?.method && inArray(requestLogsTable.method, filters.method),
          ].filter(Boolean),
          ...(filters?.fromDate
            ? [gte(requestLogsTable.timestamp, new Date(filters.fromDate))]
            : []),
          ...(filters?.toDate
            ? [lte(requestLogsTable.timestamp, new Date(filters.toDate))]
            : []),
          ...(filters?.q
            ? [ilike(requestLogsTable.url, `%${filters.q}%`)]
            : []),
        ),
      )
      .leftJoin(ApiKeys, eq(requestLogsTable.apiKeyId, ApiKeys.id))
      .groupBy(requestLogsTable.id, ApiKeys.name, ApiKeys.id)
      .limit(limit ?? ITEMS_PER_QUERY)
      .offset(((page <= 0 ? 1 : page) - 1) * (limit ?? ITEMS_PER_QUERY))
      .orderBy(desc(requestLogsTable.timestamp));

    const [{ count }] = await db
      .select({ count: sql`count(*)`.mapWith(Number).as('count') })
      .from(requestLogsTable)
      .where(
        and(
          eq(requestLogsTable.projectId, projectId),
          ...[
            filters?.apiKey &&
              inArray(requestLogsTable.apiKeyId, filters.apiKey),
            filters?.statusCode &&
              inArray(requestLogsTable.statusCode, filters.statusCode),
            filters?.method && inArray(requestLogsTable.method, filters.method),
          ].filter(Boolean),
          ...(filters?.fromDate
            ? [gte(requestLogsTable.timestamp, new Date(filters.fromDate))]
            : []),
          ...(filters?.toDate
            ? [lte(requestLogsTable.timestamp, new Date(filters.toDate))]
            : []),
          ...(filters?.q
            ? [ilike(requestLogsTable.url, `%${filters.q}%`)]
            : []),
        ),
      );

    return {
      items: logs,
      totalItems: count,
      itemsPerQuery: limit ?? ITEMS_PER_QUERY,
    };
  }

  async getApiRequestLog(logId: string, projectId: string, userId: string) {
    this.logger.log(`Getting API log for logId: ${logId}`);
    const project = await db.query.projects.findFirst({
      where: and(eq(projects.id, projectId), eq(projects.userId, userId)),
    });
    if (!project) {
      this.logger.warn(`Project not found: ${projectId}`);
      throw new HttpException('No project found', HttpStatus.NOT_FOUND);
    }

    const log = await db.query.requestLogs.findFirst({
      where: and(
        eq(requestLogsTable.id, logId),
        eq(requestLogsTable.projectId, projectId),
      ),
      with: {
        applicationLogs: {
          columns: {
            id: true,
            level: true,
            message: true,
            timestamp: true,
            additionalInfo: true,
            functionName: true,
            component: true,
            iv: true,
          },
        },
      },
    });
    if (!log) {
      this.logger.warn(`Log not found: ${logId}`);
      throw new HttpException('No log found', HttpStatus.NOT_FOUND);
    }
    return log;
  }

  async getApplicationLogs(
    projectId: string,
    userId: string,
    page: number,
    limit: number,
    filters?: ApplicationLogFilters,
  ) {
    const project = await db.query.projects.findFirst({
      where: and(eq(projects.id, projectId), eq(projects.userId, userId)),
    });
    if (!project) {
      this.logger.warn(`Project not found: ${projectId}`);
      throw new HttpException('No project found', HttpStatus.NOT_FOUND);
    }
    const {
      id,
      level,
      message,
      timestamp,
      additionalInfo,
      functionName,
      component,
      apiKeyId,
      projectId: projectIdColumn,
    } = getTableColumns(applicationLogsTable);
    const logs = await db
      .select({
        id,
        level,
        message,
        timestamp,
        additionalInfo,
        functionName,
        component,
        apiKeyId,
        projectId: projectIdColumn,
        apiKeyName: ApiKeys.name,
      })
      .from(applicationLogsTable)
      .where(
        and(
          eq(applicationLogsTable.projectId, projectId),
          ...[
            filters?.apiKey &&
              inArray(applicationLogsTable.apiKeyId, filters.apiKey),
            filters?.component &&
              inArray(applicationLogsTable.component, filters.component),
            filters?.functionName &&
              inArray(applicationLogsTable.functionName, filters.functionName),
            filters?.level &&
              inArray(
                applicationLogsTable.level,
                filters.level as typeof LogLevelEnum.enumValues,
              ),
          ].filter(Boolean),
          ...(filters?.fromDate
            ? [gte(applicationLogsTable.timestamp, new Date(filters.fromDate))]
            : []),
          ...(filters?.toDate
            ? [lte(applicationLogsTable.timestamp, new Date(filters.toDate))]
            : []),
          ...(filters?.q
            ? [ilike(applicationLogsTable.message, `%${filters.q}%`)]
            : []),
        ),
      )
      .leftJoin(ApiKeys, eq(applicationLogsTable.apiKeyId, ApiKeys.id))
      .groupBy(applicationLogsTable.id, ApiKeys.name, ApiKeys.id)
      .limit(limit ?? ITEMS_PER_QUERY)
      .offset(((page <= 0 ? 1 : page) - 1) * (limit ?? ITEMS_PER_QUERY))
      .orderBy(desc(applicationLogsTable.timestamp));

    const [{ count }] = await db
      .select({ count: sql`count(*)`.mapWith(Number).as('count') })
      .from(applicationLogsTable)
      .where(
        and(
          eq(applicationLogsTable.projectId, projectId),
          ...[
            filters?.apiKey &&
              inArray(applicationLogsTable.apiKeyId, filters.apiKey),
            filters?.component &&
              inArray(applicationLogsTable.component, filters.component),
            filters?.functionName &&
              inArray(applicationLogsTable.functionName, filters.functionName),
            filters?.level &&
              inArray(
                applicationLogsTable.level,
                filters.level as typeof LogLevelEnum.enumValues,
              ),
          ].filter(Boolean),
          ...(filters?.fromDate
            ? [gte(applicationLogsTable.timestamp, new Date(filters.fromDate))]
            : []),
          ...(filters?.toDate
            ? [lte(applicationLogsTable.timestamp, new Date(filters.toDate))]
            : []),
          ...(filters?.q
            ? [ilike(applicationLogsTable.message, `%${filters.q}%`)]
            : []),
        ),
      );
    return {
      items: logs,
      totalItems: count,
      itemsPerQuery: limit ?? ITEMS_PER_QUERY,
    };
  }

  async getApplicationLog(logId: string, projectId: string, userId: string) {
    this.logger.log(`Getting application log for logId: ${logId}`);
    const project = await db.query.projects.findFirst({
      where: and(eq(projects.id, projectId), eq(projects.userId, userId)),
    });
    if (!project) {
      this.logger.warn(`Project not found: ${projectId}`);
      throw new HttpException('No project found', HttpStatus.NOT_FOUND);
    }
    const log = await db.query.applicationLogs.findFirst({
      where: and(
        eq(applicationLogsTable.id, logId),
        eq(applicationLogsTable.projectId, projectId),
      ),
      with: {
        apiKey: {
          columns: {
            id: true,
            name: true,
          },
        },
        request: {
          columns: {
            id: true,
            url: true,
          },
        },
      },
    });
    if (!log) {
      this.logger.warn(`Log not found: ${logId}`);
      throw new HttpException('No log found', HttpStatus.NOT_FOUND);
    }
    return log;
  }

  @Cron(CronExpression.EVERY_10_MINUTES)
  async deleteTestLogs() {
    const projects = await db.query.projects.findMany({
      columns: {
        id: true,
      },
    });

    for (const project of projects) {
      const testingApiKeys = await db.query.ApiKeys.findMany({
        where: and(eq(ApiKeys.projectId, project.id), eq(ApiKeys.mode, 'test')),
        columns: {
          id: true,
        },
      });

      await db.delete(requestLogsTable).where(
        and(
          lte(requestLogsTable.timestamp, sub(new Date(), { hours: 1 })),
          inArray(
            requestLogsTable.apiKeyId,
            testingApiKeys.map((key) => key.id),
          ),
        ),
      );
      await db.delete(applicationLogsTable).where(
        and(
          lte(applicationLogsTable.timestamp, sub(new Date(), { hours: 1 })),
          inArray(
            applicationLogsTable.apiKeyId,
            testingApiKeys.map((key) => key.id),
          ),
        ),
      );

      await db.delete(systemLogs).where(
        and(
          lte(systemLogs.timestamp, sub(new Date(), { hours: 1 })),
          inArray(
            systemLogs.apiKeyId,
            testingApiKeys.map((key) => key.id),
          ),
        ),
      );
    }

    this.standaloneLogsTrapService.trace('Deleted test logs older than 1 hour');
  }
}
