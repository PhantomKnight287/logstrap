import { Module } from '@nestjs/common';
import { LogsService } from './logs.service';
import { LogsController } from './logs.controller';
import { AuthService } from '~/resources/auth/auth.service';
import { KeysService } from '../keys/keys.service';

@Module({
  controllers: [LogsController],
  providers: [LogsService, AuthService, KeysService],
})
export class LogsModule {}
