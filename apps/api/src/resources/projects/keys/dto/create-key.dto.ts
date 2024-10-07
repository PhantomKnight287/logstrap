import { projectMode } from '@logstrap/db';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateKeyDto {
  @ApiProperty({
    enum: projectMode.enumValues,
    enumName: 'ProjectMode',
  })
  @IsEnum(projectMode.enumValues)
  mode: (typeof projectMode.enumValues)[number];

  @ApiProperty({ required: false, description: 'Description for the key' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Name of the API Key, will be used for searching and sorting',
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}
