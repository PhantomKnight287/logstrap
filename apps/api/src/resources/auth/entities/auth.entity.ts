import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDecimal, IsString } from 'class-validator';

export class Auth {}

export class UserEntity {
  @ApiProperty({})
  @IsString()
  id: string;

  @ApiProperty({})
  @IsString()
  name: string;

  @ApiProperty({ description: 'ISO8601 timestamp' })
  @IsString()
  createdAt: string;

  @ApiProperty({})
  @IsString()
  email: string;

  @ApiProperty({})
  @IsDecimal()
  walletBalance: number;
}

export class LoginSuccessfulEntity {
  @ApiProperty({})
  @Type(() => UserEntity)
  user: UserEntity;

  @ApiProperty({ description: 'JWT token' })
  @IsString()
  token: string;
}

export class RegisterSuccessfulEntity extends LoginSuccessfulEntity {}
