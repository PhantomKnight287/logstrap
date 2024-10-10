import { IsObject, IsString } from 'class-validator';
import { PartialRequestLogEntity } from './response.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class LogEntity extends PartialRequestLogEntity {
  @ApiProperty({
    type: Object,
  })
  @IsObject()
  @Expose()
  requestBody: string;

  @ApiPropertyOptional({
    type: Object,
  })
  @IsObject()
  @Expose()
  responseBody: string;

  @ApiPropertyOptional({
    type: Object,
  })
  @IsObject()
  @Expose()
  requestHeaders: string;

  @ApiPropertyOptional({
    type: Object,
  })
  @IsObject()
  @Expose()
  responseHeaders: string;

  @ApiPropertyOptional({
    type: Object,
  })
  @IsObject()
  @Expose()
  cookies: string;

  @ApiPropertyOptional({
    type: String,
  })
  @IsString()
  @Expose()
  ip: string;
}
