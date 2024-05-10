import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProjectDTO } from './dto/create-project.dto';
import { prisma } from 'src/db';
import { createId } from '@paralleldrive/cuid2';
import { UpdateProjectDTO } from './dto/update-project.dto';

@Injectable()
export class ProjectService {
  async createProject(body: CreateProjectDTO, userId: string) {
    const project = await prisma.project.create({
      data: {
        id: `project_${createId()}`,
        name: body.name,
        description: body.description,
        user: { connect: { id: userId } },
      },
    });
    return {
      id: project.id,
    };
  }
  async updateProject(body: UpdateProjectDTO, id: string, userId: string) {
    const project = await prisma.project.findFirst({
      where: { id, userId },
    });
    if (!project)
      throw new HttpException(
        'No project found with given id.',
        HttpStatus.NOT_FOUND,
      );
    await prisma.project.update({
      where: { id },
      data: {
        name: body.name,
        description: body.description,
      },
    });
    return {
      id: project.id,
    };
  }

  async listProjects(userId: string) {
    return await prisma.project.findMany({
      where: {
        userId,
      },
      select: {
        name: true,
        id: true,
        description: true,
        createdAt: true,
      },
    });
  }
}
