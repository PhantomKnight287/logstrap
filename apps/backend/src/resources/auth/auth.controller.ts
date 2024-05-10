import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDTO } from './dto/login.dto';
import { SignupDTO } from './dto/signup.dto';
import { Auth } from 'src/decorators/auth/auth.decorator';
import { User } from '@prisma/client';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: LoginDTO) {
    return await this.authService.login(body);
  }

  @Post('register')
  async register(@Body() body: SignupDTO) {
    return await this.authService.signup(body);
  }

  @Get('hydrate')
  async hydrate(@Auth() auth: Partial<User>) {
    return await this.authService.hydrateUser(auth.id);
  }
}
