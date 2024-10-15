import { LogLevelEnum } from '@logstrap/db';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type, Expose } from 'class-transformer';
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
import { IsType } from '~/decorators/is-type/is-type.decorator';
export class CreateApplicationLogDto {
  @ApiPropertyOptional({
    description: 'Timestamp of the log entry',
    type: 'string',
    format: 'date-time',
  })
  @IsOptional()
  @IsDateString()
  @Expose()
  timestamp?: string;

  @ApiProperty({
    description: 'Log level',
    enum: LogLevelEnum.enumValues,
    enumName: 'LogLevel',
  })
  @IsEnum(LogLevelEnum.enumValues)
  @Expose()
  level: (typeof LogLevelEnum.enumValues)[number];

  @ApiProperty({ description: 'Log message' })
  @IsString()
  @Expose()
  message: string;

  @ApiPropertyOptional({ description: 'Component that generated the log' })
  @IsOptional()
  @IsString()
  @Expose()
  component?: string;

  @ApiPropertyOptional({
    description: 'Function name where the log was generated',
  })
  @IsOptional()
  @IsString()
  @Expose()
  functionName?: string;

  @ApiPropertyOptional({
    description: 'Additional information',
    type: 'object',
  })
  @IsOptional()
  @IsObject()
  @Expose()
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
  @Expose()
  timestamp?: string;

  @ApiProperty({
    description: 'Log level',
    enum: LogLevelEnum.enumValues,
    enumName: 'LogLevel',
  })
  @IsEnum(LogLevelEnum.enumValues)
  @Expose()
  level: (typeof LogLevelEnum.enumValues)[number];

  @ApiProperty({ description: 'Log message' })
  @IsString()
  @Expose()
  message: string;

  @ApiPropertyOptional({ description: 'Type of system event' })
  @IsOptional()
  @IsString()
  @Expose()
  eventType?: string;

  @ApiPropertyOptional({ description: 'Additional details', type: 'object' })
  @IsOptional()
  @IsObject()
  @Expose()
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
  @Expose()
  timestamp: string;

  @ApiProperty({
    description: 'Time taken for your service to send response',
    required: false,
    type: 'number',
  })
  @IsOptional()
  timeTaken: number;

  @ApiProperty({
    description: 'Request method',
  })
  @IsString({ message: 'Please provide a valid request method' })
  @IsNotEmpty({ message: 'Request method cannot be empty' })
  @Expose()
  method: string;

  @ApiProperty({
    description:
      'The url where request was made(/api/v1..., https://api.com/v1/)',
  })
  @IsString({ message: 'Please provide a valid url' })
  @IsNotEmpty({ message: 'Url cannot be empty' })
  @Expose()
  url: string;

  @ApiProperty({ description: 'Status code of this request' })
  @IsNumber(undefined, {
    message: 'Please enter a valid number as status code',
  })
  @IsPositive({ message: 'Status code must always be positive' })
  @Expose()
  statusCode: number;

  @ApiProperty({
    description: 'The request body(only supports json)',
    required: false,
  })
  @IsType([Object, Array], {
    message: 'Request body must be a valid object or array',
  })
  @IsOptional()
  @Expose()
  requestBody: object;

  @ApiProperty({
    description: 'The response body(only supports json)',
    required: false,
    type: Object,
  })
  @IsType([Object, Array], {
    message: 'Response body must be a valid object or array',
  })
  @IsOptional()
  @Expose()
  responseBody: object;

  @ApiProperty({
    description: 'The request headers(only supports json)',
    required: false,
  })
  @IsType([Object, Array], {
    message: 'Request headers must be a valid object or array',
  })
  @IsOptional()
  @Expose()
  requestHeaders: object;

  @ApiProperty({
    description: 'The response headers(only supports json)',
    required: false,
  })
  @IsType([Object, Array], {
    message: 'Response headers must be a valid object or array',
  })
  @IsOptional()
  @Expose()
  responseHeaders: object;

  @ApiProperty({
    description: 'The request cookies(only supports json)',
    required: false,
  })
  @IsType([Object, Array], {
    message: 'Cookies must be a valid object or array',
  })
  @IsOptional()
  @Expose()
  cookies: object;

  @ApiProperty({
    description: 'The ip from where the request was made',
    required: false,
    type: String,
  })
  @IsIP()
  @IsOptional()
  @Expose()
  ip?: string;

  @ApiProperty({
    description: 'The user agent from where the request was made',
    required: false,
  })
  @IsString()
  @IsOptional()
  @Expose()
  userAgent?: string;

  @ApiPropertyOptional({
    description: 'Application Logs related to this request',
    type: [CreateApplicationLogDto],
  })
  @Type(() => CreateApplicationLogDto)
  @IsArray()
  @ValidateNested({ each: true })
  @IsOptional()
  @Expose()
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
  @Expose()
  requests: RequestLogDTO[];

  @ApiPropertyOptional({
    description: 'Application logs',
    type: [CreateApplicationLogDto],
  })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateApplicationLogDto)
  @Expose()
  applicationLogs: CreateApplicationLogDto[];

  @ApiPropertyOptional({
    description: 'System logs(like when a process crashes)',
    type: [CreateSystemLogDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSystemLogDto)
  @IsOptional()
  @Expose()
  systemLogs: CreateSystemLogDto[];
}
