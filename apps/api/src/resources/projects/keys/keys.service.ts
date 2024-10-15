import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateKeyDto } from './dto/create-key.dto';
import { UpdateKeyDto } from './dto/update-key.dto';
import { db } from '~/db';
import { and, count, eq, getTableColumns, sql } from 'drizzle-orm';
import {
  ApiKeys,
  projects,
  users,
  requestLogs,
  applicationLogs,
} from '@logstrap/db';
import { init } from '@paralleldrive/cuid2';
import { hash, verify } from 'argon2';
import { plainToInstance } from 'class-transformer';
import {
  CreateKeyResponse,
  FetchAllKeysResponse,
} from './entities/response.entity';
import { ITEMS_PER_QUERY } from '~/constants';

const createId = init({
  length: 10,
});

@Injectable()
export class KeysService {
  protected logger = new Logger(KeysService.name);
  async create(body: CreateKeyDto, projectId: string, userId: string) {
    this.logger.log(
      `Create key for project: ${projectId}. Request by user: ${userId}`,
    );
    const project = await db.query.projects.findFirst({
      where: and(eq(projects.id, projectId), eq(projects.userId, userId)),
    });
    if (!project) {
      this.logger.warn(`Project with id: ${projectId} not found for ${userId}`);
      throw new HttpException(
        'No project found with given id.',
        HttpStatus.NOT_FOUND,
      );
    }
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });
    if (!user.emailVerified && body.mode === 'live') {
      this.logger.warn(
        `${userId} tried to created a "live" key without verified email.`,
      );
      throw new HttpException(
        'Creating live key requires a verified email.',
        HttpStatus.FORBIDDEN,
      );
    }
    const projectKey = `key_${createId()}`;
    const hashedKey = await hash(projectKey);
    const [key] = await db
      .insert(ApiKeys)
      .values({
        //@ts-expect-error issue 2654 for drizzle-orm
        description: body.description,
        mode: body.mode,
        projectId,
        userId,
        key: hashedKey,
        name: body.name,
      })
      .returning();
    this.logger.log(`Created key: ${key.id} for ${projectId}`);
    return plainToInstance(CreateKeyResponse, { id: key.id, key: projectKey });
  }

  async findAll(projectId: string, userId: string) {
    this.logger.log(
      `Fetching keys of project: ${projectId}. Request by user: ${userId}`,
    );
    const project = await db.query.projects.findFirst({
      where: and(eq(projects.id, projectId), eq(projects.userId, userId)),
    });
    if (!project) {
      this.logger.warn(`Project with id: ${projectId} not found for ${userId}`);
      throw new HttpException(
        'No project found with given id.',
        HttpStatus.NOT_FOUND,
      );
    }
    const keys = await db.query.ApiKeys.findMany({
      where: eq(ApiKeys.projectId, projectId),
      orderBy(fields, operators) {
        return [operators.desc(fields.createdAt)];
      },
      columns: {
        id: true,
        name: true,
        description: true,
        createdAt: true,
        mode: true,
        projectId: true,
      },
    });
    const [{ count }] = await db
      .select({
        count: sql`count(*)`.mapWith(Number).as('count'),
      })
      .from(ApiKeys);

    this.logger.log(
      `Fetched ${count} keys for ${projectId}. Requested by user: ${userId}`,
    );
    this.logger.log(keys);
    return plainToInstance(FetchAllKeysResponse, {
      items: keys,
      totalItems: count,
      itemsPerQuery: ITEMS_PER_QUERY,
    });
  }

  async verify(projectId: string, apiKey: string) {
    const apiKeys = await db
      .select()
      .from(ApiKeys)
      .where(eq(ApiKeys.projectId, projectId));

    if (apiKeys.length === 0) {
      this.logger.warn(`No API keys found for Project: ${projectId}`);
      throw new HttpException('Invalid API Key', HttpStatus.NOT_FOUND);
    }

    for (const apiKeyRecord of apiKeys) {
      if (await verify(apiKeyRecord.key, apiKey)) {
        return apiKeyRecord;
      }
    }

    this.logger.warn(`Incorrect API Key supplied for Project: ${projectId}`);
    throw new HttpException('Invalid API Key', HttpStatus.UNAUTHORIZED);
  }

  async findOne(projectId: string, userId: string, keyId: string) {
    const { key, ...rest } = getTableColumns(ApiKeys);
    const [apiKey] = await db
      .select({
        ...rest,
      })
      .from(ApiKeys)
      .where(
        and(
          eq(ApiKeys.projectId, projectId),
          eq(ApiKeys.userId, userId),
          eq(ApiKeys.id, keyId),
        ),
      );

    const [{ count: apiRequestsCount }] = await db
      .select({
        count: sql`count(*)`.mapWith(Number).as('count'),
      })
      .from(requestLogs)
      .where(eq(requestLogs.apiKeyId, apiKey.id));

    const [{ count: applicationLogsCount }] = await db
      .select({
        count: sql`count(*)`.mapWith(Number).as('count'),
      })
      .from(applicationLogs)
      .where(eq(applicationLogs.apiKeyId, apiKey.id));

    if (!apiKey) {
      this.logger.warn(`Key with id: ${keyId} not found for ${userId}`);
      throw new HttpException(
        'No key found with given id.',
        HttpStatus.NOT_FOUND,
      );
    }
    return {
      ...apiKey,
      apiRequestsCount,
      applicationLogsCount,
    };
  }

  update(id: number, updateKeyDto: UpdateKeyDto) {
    return `This action updates a #${id} key`;
  }

  remove(id: number) {
    return `This action removes a #${id} key`;
  }
}
