import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateLogDTO } from './dto/create-log.dto';
import { prisma } from 'src/db';
import { createId } from '@paralleldrive/cuid2';

@Injectable()
export class LogsService {
  async createLog(body: CreateLogDTO, projectId: string, key: string) {
    const log = await prisma.log.create({
      data: {
        id: `log_${createId()}`,
        message: body.message,
        path: body.path,
        requestBody: body.requestBody,
        requestHeaders: body.requestHeaders,
        requestTime: body.requestTime,
        responseBody: body.responseBody,
        responseHeaders: body.responseHeaders,
        responseTime: body.responseTime,
        stackTrace: body.stackTrace,
        statusCode: body.statusCode,
        method: body.method,
        name: body.name,
        type:
          body.statusCode >= 200 && body.statusCode < 400
            ? 'Successful'
            : 'Failed',
        key: {
          connect: {
            id: key,
          },
        },
        project: {
          connect: {
            id: projectId,
          },
        },
      },
    });
    return {
      id: log.id,
    };
  }

  async listLogs(
    userId: string,
    projectId: string,
    skip?: number,
    take?: number,
  ) {
    if (
      skip !== undefined &&
      skip !== null &&
      take !== undefined &&
      skip !== null
    ) {
      const logs = await prisma.log.findMany({
        where: {
          project: {
            id: projectId,
            userId,
          },
        },
        skip,
        take,
        select: {
          statusCode: true,
          message: true,
          path: true,
          method: true,
          createdAt: true,
          projectId: true,
          id: true,
        },
      });
      return logs;
    }
    const logs = await prisma.$queryRaw`
     SELECT
      l."statusCode",l."message",l."path",l."method",l."createdAt",l."projectId",l."id"
    FROM
      "Log" l
    JOIN
      "Project" p ON l."projectId" = p.id
    WHERE
      p.id = ${projectId} AND
      p."userId" = ${userId}
    ORDER BY
      l."createdAt" DESC
    LIMIT
      100
      ;
      `;
    return {
      logs,
    };
  }

  async getLogInfo(userId: string, projectId: string, logId: string) {
    const log = await prisma.log.findFirst({
      where: {
        project: {
          id: projectId,
          userId,
        },
        id: logId,
      },
    });
    if (!log) throw new HttpException('No log found', HttpStatus.NOT_FOUND);
    return log;
  }
}
