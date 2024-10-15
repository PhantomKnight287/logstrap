import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { Project } from './project.entity';
import { IsArray, IsNumber, IsString } from 'class-validator';
import { ITEMS_PER_QUERY } from '~/constants';

export class FetchAllProjectsResponse {
  @Expose()
  @ApiProperty({ type: [Project] })
  @Type(() => Project)
  items: Project[];

  @Expose()
  @ApiProperty()
  @IsNumber()
  totalItems: number;

  @Expose()
  @ApiProperty({ default: ITEMS_PER_QUERY })
  @IsNumber()
  itemsPerQuery: number;
}

export class LogsCountResponseEntity {
  @ApiProperty({})
  @IsNumber()
  @Expose()
  today: number;

  @ApiProperty({})
  @IsNumber()
  @Expose()
  yesterday: number;

  @ApiProperty({})
  @IsNumber()
  @Expose()
  percentageChange: number;
}
export class ApiRequestsPerDayResponseEntity {
  @ApiProperty({})
  @IsString()
  @Expose()
  date: string;

  @ApiProperty({})
  @IsNumber()
  @Expose()
  count: number;
}

export class AppEventsPerDayResponseEntity {
  @ApiProperty({})
  @IsString()
  @Expose()
  date: string;

  @ApiProperty({})
  @IsNumber()
  @Expose()
  count: number;
}

export class MostUsedApiRouteResponseEntity {
  @ApiProperty({})
  @IsString()
  @Expose()
  path: string;

  @ApiProperty({})
  @IsNumber()
  @Expose()
  count: number;
}

export class MostFrequentAppEventResponseEntity {
  @ApiProperty({})
  @IsString()
  @Expose()
  event: string;

  @ApiProperty({})
  @IsNumber()
  @Expose()
  count: number;
}

export class ProjectStatsResponseEntity {
  @ApiProperty({ type: LogsCountResponseEntity })
  @Type(() => LogsCountResponseEntity)
  @Expose()
  logsCount: LogsCountResponseEntity;

  @ApiProperty({})
  @IsNumber()
  @Expose()
  totalLogs: number;

  @ApiProperty({
    type: [ApiRequestsPerDayResponseEntity],
  })
  @IsArray()
  @Expose()
  apiRequestsPerDay: ApiRequestsPerDayResponseEntity[];

  @ApiProperty({
    type: [AppEventsPerDayResponseEntity],
  })
  @IsArray()
  @Expose()
  appEventsPerDay: AppEventsPerDayResponseEntity[];

  @ApiProperty({
    type: [MostUsedApiRouteResponseEntity],
  })
  @IsArray()
  @Expose()
  mostUsedApiRoute: MostUsedApiRouteResponseEntity[];

  @ApiProperty({
    type: [MostFrequentAppEventResponseEntity],
  })
  @IsArray()
  @Expose()
  mostFrequentAppEvent: MostFrequentAppEventResponseEntity[];
}
