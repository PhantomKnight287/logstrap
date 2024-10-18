import { ApiProperty } from '@nestjs/swagger';
import { LoginDTO } from './login.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class RegisterDTO extends LoginDTO {
  @ApiProperty({})
  @IsString()
  @IsNotEmpty({ message: 'Empty name is not allowed' })
  name: string;
}
