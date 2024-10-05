import { ApiProperty } from '@nestjs/swagger';
import { LoginDTO } from './login.dto';
import { IsString } from 'class-validator';

export class RegisterDTO extends LoginDTO {
  @ApiProperty({})
  @IsString()
  name: string;
}
