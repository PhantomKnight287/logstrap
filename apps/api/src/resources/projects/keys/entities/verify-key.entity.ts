import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class VerifyKeyEntity {
  @ApiProperty({ description: 'The id of the key' })
  @Expose()
  id: string;

  @ApiProperty({ description: 'The name of the key' })
  @Expose()
  name: string;
}
