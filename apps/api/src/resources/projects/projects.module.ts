import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { AuthService } from '../auth/auth.service';

@Module({
  controllers: [ProjectsController],
  providers: [ProjectsService, AuthService],
})
export class ProjectsModule {}
