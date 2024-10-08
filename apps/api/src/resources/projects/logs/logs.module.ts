import { Module } from '@nestjs/common';
import { LogsService } from './logs.service';
import { LogsController } from './logs.controller';
import { AuthService } from '~/resources/auth/auth.service';

@Module({
  controllers: [LogsController],
  providers: [LogsService, AuthService],
})
export class LogsModule {}
