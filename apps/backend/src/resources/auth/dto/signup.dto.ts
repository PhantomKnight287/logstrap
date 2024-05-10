import { IsString } from 'class-validator';

export class SignupDTO {
  @IsString()
  username: string;

  @IsString()
  password: string;

  @IsString()
  name: string;
}
