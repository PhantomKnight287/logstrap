import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { Project } from './project.entity';
import { IsNumber } from 'class-validator';
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
