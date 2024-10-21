import { Module } from '@nestjs/common';
import { LogsService } from './logs.service';
import { LogsController } from './logs.controller';
import { AuthService } from '~/resources/auth/auth.service';
import { KeysService } from '../keys/keys.service';
import { EncryptionService } from '~/services/encryption/encryption.service';

@Module({
  controllers: [LogsController],
  providers: [LogsService, AuthService, KeysService, EncryptionService],
})
export class LogsModule {}
