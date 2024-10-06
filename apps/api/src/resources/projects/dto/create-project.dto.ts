import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateProjectDto {
  @ApiProperty({})
  @IsString()
  name: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty({ required: false })
  @IsUrl(undefined, { message: 'Please enter a valid url' })
  @IsOptional()
  url: string;
}
