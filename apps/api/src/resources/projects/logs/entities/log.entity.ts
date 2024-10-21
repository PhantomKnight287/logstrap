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
    type: String,
    description: 'Additional info(encrypted)',
  })
  @IsString()
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

  @ApiProperty({
    type: String,
    description: 'Initialization vector',
  })
  @IsString()
  @Expose()
  iv: string;
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
  request: LogEntityWithIdAndUrl;

  @ApiProperty({
    type: String,
    description: 'Initialization vector',
  })
  @IsString()
  @Expose()
  iv: string;
}

export class LogEntity extends PartialRequestLogEntity {
  @ApiProperty({
    type: String,
    description: 'Request body(encrypted)',
  })
  @IsString()
  @Expose()
  requestBody: string;

  @ApiPropertyOptional({
    type: String,
    description: 'Response body(encrypted)',
  })
  @IsString()
  @Expose()
  responseBody: string;

  @ApiPropertyOptional({
    type: String,
    description: 'Request headers(encrypted)',
  })
  @IsString()
  @Expose()
  requestHeaders: string;

  @ApiPropertyOptional({
    type: String,
    description: 'Response headers(encrypted)',
  })
  @IsString()
  @Expose()
  responseHeaders: string;

  @ApiPropertyOptional({
    type: String,
    description: 'Cookies(encrypted)',
  })
  @IsString()
  @Expose()
  cookies: string;

  @ApiPropertyOptional({
    type: String,
    description: 'IP address',
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

  @ApiProperty({
    type: String,
    description: 'Initialization vector',
  })
  @IsString()
  @Expose()
  iv: string;
}
