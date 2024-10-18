import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

export class GenericErrorEntity {
  @ApiProperty({})
  @IsString()
  @Expose()
  message: string;
}
