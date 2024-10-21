import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsString } from 'class-validator';

export class VerifyKeyDto {
  @ApiProperty()
  @IsDefined()
  @IsString()
  key: string;
}
