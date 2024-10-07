import { projectMode } from '@logstrap/db';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEnum, IsString } from 'class-validator';

export class Key {
  @ApiProperty({})
  @Expose()
  @IsString()
  id: string;

  @ApiProperty({})
  @Expose()
  @IsString()
  createdAt: string;

  @ApiProperty({ required: false })
  @Expose()
  @IsString()
  description: string;

  @ApiProperty({ enum: projectMode.enumValues, enumName: 'ProjectMode' })
  @Expose()
  @IsEnum(projectMode.enumValues)
  mode: string;
}
