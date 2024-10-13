import { ApiProperty, ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { RequestLogDTO, CreateApplicationLogDto } from '../dto/create-log.dto';
import { Expose, Type } from 'class-transformer';
import { IsArray, IsNumber, IsString } from 'class-validator';
import { ITEMS_PER_QUERY } from '~/constants';
export class PartialApiKeyEntity {
  @ApiProperty({})
  @IsString()
  @Expose()
  id: string;

  @ApiProperty({})
  @IsString()
  @Expose()
  name: string;
}
export class ExtendedApplicationLogs extends CreateApplicationLogDto {
  @Expose()
  @ApiProperty({})
  @IsString()
  id: string;
}

export class ExtendedRequestLogDTO extends OmitType(RequestLogDTO, [
  'applicationLogs',
]) {
  @Expose()
  @ApiProperty({})
  @IsString()
  id: string;

  @Expose()
  @ApiProperty({ type: Number })
  @IsNumber()
  applicationLogsCount: number;
}

export class PartialRequestLogEntity {
  @ApiProperty({})
  @IsString()
  @Expose()
  id: string;

  @ApiProperty({})
  @IsString()
  @Expose()
  url: string;

  @ApiProperty({})
  @IsString()
  @Expose()
  timestamp: string;

  @ApiProperty({})
  @IsString()
  @Expose()
  userAgent: string;

  @ApiProperty({})
  @IsNumber()
  @Expose()
  applicationLogsCount: number;

  @ApiProperty({})
  @IsString()
  @Expose()
  method: string;

  @ApiProperty({})
  @IsNumber()
  @Expose()
  statusCode: number;

  @ApiProperty({})
  @IsString()
  @Expose()
  apiKeyId: string;

  @ApiProperty({})
  @IsString()
  @Expose()
  projectId: string;

  @ApiPropertyOptional({})
  @IsNumber()
  @Expose()
  timeTaken: string;

  @ApiPropertyOptional({})
  @IsString()
  @Expose()
  apiKeyName: string;
}

export class FetchRequestLogsResponseEntity {
  @ApiProperty({ type: [PartialRequestLogEntity] })
  @Type(() => PartialRequestLogEntity)
  @IsArray()
  @Expose()
  items: PartialRequestLogEntity[];

  @Expose()
  @ApiProperty()
  @IsNumber()
  totalItems: number;

  @Expose()
  @ApiProperty({ default: ITEMS_PER_QUERY })
  @IsNumber()
  itemsPerQuery: number;
}

export class ProjectApiRequestSearchFiltersResponse {
  @ApiProperty({
    type: [Number],
    description: 'List of available status codes',
  })
  @Expose()
  @IsArray()
  @IsNumber({}, { each: true })
  statusCodes: number[];

  @ApiProperty({
    type: [String],
    description: 'List of available methods',
  })
  @Expose()
  @IsArray()
  @IsString({ each: true })
  methods: string[];

  @ApiProperty({
    type: [PartialApiKeyEntity],
    description: 'List of available api keys',
  })
  @Expose()
  @Type(() => PartialApiKeyEntity)
  @IsArray()
  apiKeys: PartialApiKeyEntity[];
}
