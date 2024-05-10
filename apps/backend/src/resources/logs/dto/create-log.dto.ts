import {
  IsISO8601,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateLogDTO {
  @IsNumber()
  statusCode: number;

  @IsString()
  path: string;

  @IsString()
  @IsOptional()
  message: string;

  @IsObject()
  @IsOptional()
  requestHeaders: Record<string, string>;

  @IsString()
  @IsOptional()
  requestBody: string;

  @IsObject()
  @IsOptional()
  responseHeaders: Record<string, string>;

  @IsString()
  @IsOptional()
  responseBody: string;

  @IsISO8601()
  @IsOptional()
  requestTime: string;

  @IsISO8601()
  @IsOptional()
  responseTime: string;

  @IsString()
  @IsOptional()
  stackTrace: string;

  @IsString()
  @IsOptional()
  method: string;
}
