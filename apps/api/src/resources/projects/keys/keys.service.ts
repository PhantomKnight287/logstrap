import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateKeyDto } from './dto/create-key.dto';
import { UpdateKeyDto } from './dto/update-key.dto';
import { db } from '~/db';
import { and, eq, sql } from 'drizzle-orm';
import { ApiKeys, projects, users } from '@logstrap/db';
import { init } from '@paralleldrive/cuid2';
import { hash } from 'argon2';
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

  findOne(id: number) {
    return `This action returns a #${id} key`;
  }

  update(id: number, updateKeyDto: UpdateKeyDto) {
    return `This action updates a #${id} key`;
  }

  remove(id: number) {
    return `This action removes a #${id} key`;
  }
}
