import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateLogDto } from './dto/create-log.dto';
import { UpdateLogDto } from './dto/update-log.dto';
import { db } from '~/db';
import { ApiKeys, applicationLogs, requestLogs } from '@logstrap/db';
import { eq } from 'drizzle-orm';
import { verify } from 'argon2';

@Injectable()
export class LogsService {
  protected logger = new Logger(LogsService.name);
  async create(body: CreateLogDto, projectId: string, apiKey: string) {
    this.logger.log(`Creating logs for Project: ${projectId}`);
    const apiKeys = await db
      .select()
      .from(ApiKeys)
      .where(eq(ApiKeys.projectId, projectId));

    if (apiKeys.length === 0) {
      this.logger.warn(`No API keys found for Project: ${projectId}`);
      throw new HttpException('Invalid API Key', HttpStatus.NOT_FOUND);
    }

    let isApiKeyCorrect = false;
    let apiKeyRecord: typeof ApiKeys.$inferSelect | null = null;
    for (const _apiKeyRecord of apiKeys) {
      if (await verify(_apiKeyRecord.key, apiKey)) {
        isApiKeyCorrect = true;
        apiKeyRecord = _apiKeyRecord;
        break;
      }
    }

    if (!isApiKeyCorrect) {
      this.logger.warn(`Incorrect API Key supplied for Project: ${projectId}`);
      throw new HttpException('Invalid API Key', HttpStatus.UNAUTHORIZED);
    }
    if (body.requests) {
      const apiRequest = await db.transaction(async (tx) => {
        for (const request of body.requests) {
          const [baseApiRequest] = await tx
            .insert(requestLogs)
            //@ts-expect-error
            .values({
              apiKeyId: apiKeyRecord.id,
              method: request.method,
              projectId,
              url: request.url,
              // timestamp: request.timestamp ?? new Date(),
              statusCode: request.statusCode,
              requestBody: request.requestBody,
              requestHeaders: request.requestHeaders,
              responseBody: request.responseBody,
              responseHeaders: request.responseHeaders,
              cookies: request.cookies,
              ip: request.ip,
              userAgent: request.userAgent,
            })
            .returning();
          for (const applicationLog of request.applicationLogs) {
            await tx
              .insert(applicationLogs)
              //@ts-expect-error
              .values({
                apiKeyId: apiKeyRecord.id,
                level: applicationLog.level,
                message: applicationLog.message,
                projectId,
                requestId: baseApiRequest.id,
                // timestamp: request.timestamp ?? new Date(),
                component: applicationLog.component,
                functionName: applicationLog.functionName,
                additionalInfo: applicationLog.additionalInfo,
              });
          }
        }
      });
    }
    return {
      message: 'Logged',
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
