import { projectMode } from '@logstrap/db';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEnum, IsOptional, IsString, IsUrl } from 'class-validator';

export class Project {
  @ApiProperty({})
  @Expose()
  @IsString()
  id: string;

  @ApiProperty()
  @Expose()
  @IsString()
  name: string;

  @ApiProperty({ required: false })
  @Expose()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ required: false })
  @Expose()
  @IsUrl()
  @IsOptional()
  url?: string;

  @ApiProperty({ enum: projectMode.enumValues, enumName: 'ProjectMode' })
  @Expose()
  @IsEnum(projectMode.enumValues)
  mode: string;
}

export class ProjectIdEntity extends PickType(Project, ['id']) {}
