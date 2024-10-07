import { Module } from '@nestjs/common';
import { KeysService } from './keys.service';
import { KeysController } from './keys.controller';

@Module({
  controllers: [KeysController],
  providers: [KeysService],
})
export class KeysModule {}
