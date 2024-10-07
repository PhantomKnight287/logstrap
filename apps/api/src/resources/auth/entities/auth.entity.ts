import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsBoolean, IsDecimal, IsString } from 'class-validator';

export class Auth {}

export class UserEntity {
  @ApiProperty({})
  @IsString()
  @Expose()
  id: string;

  @ApiProperty({})
  @IsString()
  @Expose()
  name: string;

  @ApiProperty({ description: 'ISO8601 timestamp' })
  @IsString()
  @Expose()
  createdAt: string;

  @ApiProperty({
    description: 'a decimal with precision upto 2 digits',
  })
  @IsString()
  @Expose()
  walletBalance: string;

  @ApiProperty({
    type: Boolean,
  })
  @IsBoolean()
  @Expose()
  emailVerified: boolean;
}

export class LoginSuccessfulEntity {
  @ApiProperty({})
  @Type(() => UserEntity)
  @Expose()
  user: UserEntity;

  @ApiProperty({ description: 'JWT token' })
  @IsString()
  @Expose()
  token: string;
}

export class RegisterSuccessfulEntity extends LoginSuccessfulEntity {}
