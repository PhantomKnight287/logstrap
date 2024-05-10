import { IsOptional, IsString } from 'class-validator';

export class CreateProjectDTO {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description: string;
}
