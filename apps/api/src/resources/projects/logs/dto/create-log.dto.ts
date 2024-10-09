import { LogLevelEnum } from '@logstrap/db';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsIP,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';
export class CreateApplicationLogDto {
  @ApiPropertyOptional({
    description: 'Timestamp of the log entry',
    type: 'string',
    format: 'date-time',
  })
  @IsOptional()
  @IsDateString()
  timestamp?: string;

  @ApiProperty({
    description: 'Log level',
    enum: LogLevelEnum.enumValues,
    enumName: 'LogLevel',
  })
  @IsEnum(LogLevelEnum.enumValues)
  level: (typeof LogLevelEnum.enumValues)[number];

  @ApiProperty({ description: 'Log message' })
  @IsString()
  message: string;

  @ApiPropertyOptional({ description: 'Component that generated the log' })
  @IsOptional()
  @IsString()
  component?: string;

  @ApiPropertyOptional({
    description: 'Function name where the log was generated',
  })
  @IsOptional()
  @IsString()
  functionName?: string;

  @ApiPropertyOptional({
    description: 'Additional information',
    type: 'object',
  })
  @IsOptional()
  @IsObject()
  additionalInfo?: Record<string, any>;
}

export class CreateSystemLogDto {
  @ApiPropertyOptional({
    description: 'Timestamp of the log entry',
    type: 'string',
    format: 'date-time',
  })
  @IsOptional()
  @IsDateString()
  timestamp?: string;

  @ApiProperty({
    description: 'Log level',
    enum: LogLevelEnum.enumValues,
    enumName: 'LogLevel',
  })
  @IsEnum(LogLevelEnum.enumValues)
  level: (typeof LogLevelEnum.enumValues)[number];

  @ApiProperty({ description: 'Log message' })
  @IsString()
  message: string;

  @ApiPropertyOptional({ description: 'Type of system event' })
  @IsOptional()
  @IsString()
  eventType?: string;

  @ApiPropertyOptional({ description: 'Additional details', type: 'object' })
  @IsOptional()
  @IsObject()
  details?: Record<string, any>;
}
export class RequestLogDTO {
  @ApiProperty({
    description: 'timestamp when log was created',
    required: false,
    type: 'date-time',
  })
  @IsDateString(undefined, {
    message: 'Please provide a valid timestamp',
  })
  @IsOptional()
  timestamp: string;

  @ApiProperty({
    description: 'Request method',
  })
  @IsString({ message: 'Please provide a valid request method' })
  @IsNotEmpty({ message: 'Request method cannot be empty' })
  method: string;

  @ApiProperty({
    description:
      'The url where request was made(/api/v1..., https://api.com/v1/)',
  })
  @IsString({ message: 'Please provide a valid url' })
  @IsNotEmpty({ message: 'Url cannot be empty' })
  url: string;

  @ApiProperty({ description: 'Status code of this request' })
  @IsNumber(undefined, {
    message: 'Please enter a valid number as status code',
  })
  @IsPositive({ message: 'Status code must always be positive' })
  statusCode: number;

  @ApiProperty({
    description: 'The request body(only supports json)',
    required: false,
  })
  @IsObject({ message: 'Request body must be a valid object' })
  @IsOptional()
  requestBody: object;

  @ApiProperty({
    description: 'The response body(only supports json)',
    required: false,
  })
  @IsObject({ message: 'Response body must be a valid object' })
  @IsOptional()
  responseBody: object;

  @ApiProperty({
    description: 'The request headers(only supports json)',
    required: false,
  })
  @IsObject({ message: 'Request headers must be a valid object' })
  @IsOptional()
  requestHeaders: object;

  @ApiProperty({
    description: 'The response headers(only supports json)',
    required: false,
  })
  @IsObject({ message: 'Response headers must be a valid object' })
  @IsOptional()
  responseHeaders: object;

  @ApiProperty({
    description: 'The request cookies(only supports json)',
    required: false,
  })
  @IsObject({ message: 'Cookies must be a valid object' })
  @IsOptional()
  cookies: object;

  @ApiProperty({
    description: 'The ip from where the request was made',
    required: false,
    type: String,
  })
  @IsIP()
  @IsOptional()
  ip?: string;

  @ApiProperty({
    description: 'The user agent from where the request was made',
    required: false,
  })
  @IsString()
  @IsOptional()
  userAgent?: string;

  @ApiPropertyOptional({
    description: 'Application Logs related to this request',
    type: [CreateApplicationLogDto],
  })
  @Type(() => CreateApplicationLogDto)
  @IsArray()
  @ValidateNested({ each: true })
  @IsOptional()
  applicationLogs?: CreateApplicationLogDto[];
}

export class CreateLogDto {
  @ApiPropertyOptional({
    description: 'Requests associated to this log',
    type: [RequestLogDTO],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RequestLogDTO)
  requests: RequestLogDTO[];

  @ApiPropertyOptional({
    description: 'Application logs',
    type: [CreateApplicationLogDto],
  })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateApplicationLogDto)
  applicationLogs: CreateApplicationLogDto[];

  @ApiPropertyOptional({
    description: 'System logs(like when a process crashes)',
    type: [CreateSystemLogDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSystemLogDto)
  @IsOptional()
  systemLogs: CreateSystemLogDto[];
}
