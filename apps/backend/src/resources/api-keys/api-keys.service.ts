import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateApiKeyDTO } from './dto/create-key.dto';
import { prisma } from 'src/db';
import { createId } from '@paralleldrive/cuid2';
import * as IdGenerator from 'stripe-id-generator';

@Injectable()
export class ApiKeysService {
  //@ts-expect-error idk
  generator = new IdGenerator(['key']);
  async createKey(body: CreateApiKeyDTO, projectId: string, userId: string) {
    const project = await prisma.project.findFirst({
      where: { id: projectId, userId },
    });
    if (!project)
      throw new HttpException(
        'No project found with given id.',
        HttpStatus.NOT_FOUND,
      );

    const key = await prisma.apiKey.create({
      data: {
        id: `key_${createId()}`,
        key: this.generator.new('key'),
        name: body.name,
        project: { connect: { id: projectId } },
      },
    });
    return {
      id: key.key,
    };
  }

  async verifyKey(apiKey: string) {
    const key = await prisma.apiKey.findFirst({
      where: { key: apiKey },
      include: { project: true },
    });
    if (!key) throw new HttpException('No API Key Found', HttpStatus.NOT_FOUND);
    return { ...key.project, key: key.id };
  }

  async listKeys(projectId: string, userId: string) {
    const keys = await prisma.apiKey.findMany({
      where: {
        project: {
          id: projectId,
          userId,
        },
      },
      select: {
        id: true,
        name: true,
        createdAt: true,
        key: true,
      },
    });
    return keys;
  }
}
