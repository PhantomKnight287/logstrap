import { IsArray, IsDate, IsEnum, IsObject, IsString } from 'class-validator';
import {
  PartialApiKeyEntity,
  PartialRequestLogEntity,
} from './response.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { LogLevelEnum } from '@logstrap/db';

export class ApplicationLogEntity {
  @ApiProperty({
    type: String,
  })
  @IsString()
  @Expose()
  id: string;

  @ApiProperty({
    enum: LogLevelEnum.enumValues,
  })
  @IsEnum(LogLevelEnum.enumValues)
  @Expose()
  level: (typeof LogLevelEnum.enumValues)[number];

  @ApiProperty({
    type: String,
  })
  @IsString()
  @Expose()
  message: string;

  @ApiProperty({
    type: Date,
  })
  @IsDate()
  @Expose()
  timestamp: Date;

  @ApiPropertyOptional({
    type: Object,
  })
  @IsObject()
  @Expose()
  additionalInfo: string;

  @ApiPropertyOptional({
    type: String,
  })
  @IsString()
  @Expose()
  functionName: string;

  @ApiPropertyOptional({
    type: String,
  })
  @IsString()
  @Expose()
  component: string;
}
export class LogEntityWithIdAndUrl {
  @ApiProperty({
    type: String,
  })
  @IsString()
  @Expose()
  id: string;

  @ApiProperty({
    type: String,
  })
  @IsString()
  @Expose()
  url: string;
}

export class ExtendedApplicationLogEntity extends ApplicationLogEntity {
  // add api key and request log id
  @ApiProperty({
    type: PartialApiKeyEntity,
  })
  @IsObject()
  @Expose()
  apiKey: PartialApiKeyEntity;

  @ApiProperty({
    type: LogEntityWithIdAndUrl,
  })
  @IsObject()
  @Expose()
  requestLog: LogEntityWithIdAndUrl;
}

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

  @ApiPropertyOptional({
    type: [ApplicationLogEntity],
  })
  @IsArray()
  @Expose()
  applicationLogs: ApplicationLogEntity[];

  @ApiPropertyOptional({
    type: String,
  })
  @IsString()
  @Expose()
  apiKeyName: string;

  @ApiPropertyOptional({
    type: String,
  })
  @IsString()
  @Expose()
  apiKeyId: string;
}
