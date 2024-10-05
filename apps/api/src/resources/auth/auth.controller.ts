import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';

import { LoginDTO } from './dto/login.dto';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
  LoginSuccessfulEntity,
  RegisterSuccessfulEntity,
} from './entities/auth.entity';
import { GenericErrorEntity } from '~/entity';
import { RegisterDTO } from './dto/register.dto';

@Controller('auth')
@ApiTags('Authentication')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({
    summary: 'Login',
    description: 'Login',
  })
  @ApiOkResponse({
    type: LoginSuccessfulEntity,
  })
  @ApiNotFoundResponse({
    type: GenericErrorEntity,
    description: 'No user found with given email',
  })
  @ApiUnauthorizedResponse({
    type: GenericErrorEntity,
    description: 'Incorrect email or password',
  })
  @ApiBadRequestResponse({
    type: GenericErrorEntity,
    description: 'Invalid body',
  })
  @HttpCode(HttpStatus.OK)
  login(@Body() createAuthDto: LoginDTO) {
    return this.authService.login(createAuthDto);
  }

  @Post('register')
  @ApiOperation({
    description: 'Regsiter',
    summary: 'Register',
  })
  @ApiCreatedResponse({ type: RegisterSuccessfulEntity })
  @ApiConflictResponse({
    type: GenericErrorEntity,
    description: 'Email already taken',
  })
  @ApiBadRequestResponse({
    type: GenericErrorEntity,
    description: 'Invalid body',
  })
  register(@Body() body: RegisterDTO) {
    return this.authService.register(body);
  }
}
