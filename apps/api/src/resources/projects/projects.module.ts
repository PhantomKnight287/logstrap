import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { AuthService } from '../auth/auth.service';
import { KeysModule } from './keys/keys.module';
import { LogsModule } from './logs/logs.module';

@Module({
  controllers: [ProjectsController],
  providers: [ProjectsService, AuthService],
  imports: [KeysModule, LogsModule],
})
export class ProjectsModule {}
