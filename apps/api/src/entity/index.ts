import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class GenericErrorEntity {
  @ApiProperty({})
  @IsString()
  message: string;
}
