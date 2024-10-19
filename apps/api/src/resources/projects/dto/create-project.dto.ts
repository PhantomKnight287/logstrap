import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateProjectDto {
  @ApiProperty({})
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty({ required: false })
  @IsUrl(
    {
      require_tld: false,
      require_protocol: true,
      require_host: false,
      host_whitelist: ['localhost'],
    },
    { message: 'Please enter a valid url' },
  )
  @IsOptional()
  url: string;
}
