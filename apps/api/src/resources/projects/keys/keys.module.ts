import { Module } from '@nestjs/common';
import { KeysService } from './keys.service';
import { KeysController } from './keys.controller';
import { AuthService } from '~/resources/auth/auth.service';

@Module({
  controllers: [KeysController],
  providers: [KeysService, AuthService],
})
export class KeysModule {}
