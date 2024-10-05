import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { LoginDTO } from './dto/login.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { db } from '~/db';
import { eq } from 'drizzle-orm';
import { users } from '@logstrap/db';
import { hash, verify as verifyPassword } from 'argon2';
import { ConfigService } from '@nestjs/config';
import { sign } from 'jsonwebtoken';
import { plainToInstance } from 'class-transformer';
import {
  LoginSuccessfulEntity,
  RegisterSuccessfulEntity,
} from './entities/auth.entity';
import { RegisterDTO } from './dto/register.dto';

@Injectable()
export class AuthService {
  protected logger = new Logger(AuthService.name);
  constructor(protected configService: ConfigService) {}
  async login(body: LoginDTO) {
    const { email, password } = body;
    this.logger.log(`Login attempt for email: ${email}`);
    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });
    if (!user) {
      this.logger.warn(`No user found for email: ${email}`);
      throw new HttpException(
        'No user found with given email',
        HttpStatus.NOT_FOUND,
      );
    }
    this.logger.log(`User found for email: ${email}`);
    const isPasswordCorrect = verifyPassword(user.password, password);
    if (isPasswordCorrect) {
      this.logger.log(`Correct password supplied. Generating JWT Token...`);
      const token = sign(
        {
          id: user.id,
        },
        this.configService.getOrThrow('JWT_SECRET'),
        {
          expiresIn: '30 days',
        },
      );
      this.logger.log('Generated Token. Login successful');
      return plainToInstance(LoginSuccessfulEntity, { user, token });
    }
    this.logger.warn(`Incorrect Login password for email: ${email}`);
    throw new HttpException(
      'Incorrect email or password',
      HttpStatus.UNAUTHORIZED,
    );
  }

  async register(body: RegisterDTO) {
    const { email, name, password } = body;
    this.logger.log(`Register attempt for: ${email}`);
    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });
    if (user) {
      this.logger.warn(`email ${email} already taken`);
      throw new HttpException('Email already taken', HttpStatus.CONFLICT);
    }
    const [newUser] = await db
      .insert(users)
      .values({
        email,
        name,
        password: await hash(password),
      })
      .returning();
    this.logger.log(`Created new user with id: ${newUser.id}`);
    const token = sign(
      {
        id: user.id,
      },
      this.configService.getOrThrow('JWT_SECRET'),
      {
        expiresIn: '30 days',
      },
    );
    this.logger.log('Generated Token.');
    return plainToInstance(RegisterSuccessfulEntity, { user, token });
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
