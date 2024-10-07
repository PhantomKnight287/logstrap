import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { Key } from './key.entity';
import { IsNumber } from 'class-validator';
import { ITEMS_PER_QUERY } from '~/constants';

export class CreateKeyResponse {
  @ApiProperty({
    description: "API Key, must be stored as it can't be seen again",
  })
  @Expose()
  key: string;

  @ApiProperty({ description: 'Id of key in db' })
  @Expose()
  id: string;
}

export class FetchAllKeysResponse {
  @Expose()
  @ApiProperty({ type: [Key] })
  items: Key[];

  @Expose()
  @ApiProperty({ type: Number })
  @IsNumber()
  totalItems: number;

  @Expose()
  @ApiProperty({ default: ITEMS_PER_QUERY })
  @IsNumber()
  itemsPerQuery: number;
}
