import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class LoginDTO {
  @ApiProperty({})
  @IsEmail({}, { message: 'Please provide a valid email' })
  email: string;

  @ApiProperty({})
  @IsString({ message: 'Please enter a password' })
  password: string;
}
