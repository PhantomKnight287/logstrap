import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { LoginDTO } from './dto/login.dto';
import { db } from '~/db';
import { eq } from 'drizzle-orm';
import { users } from '@logstrap/db';
import { hash, verify as verifyPassword } from 'argon2';
import { ConfigService } from '@nestjs/config';
import { sign, verify } from 'jsonwebtoken';
import { plainToInstance } from 'class-transformer';
import {
  LoginSuccessfulEntity,
  RegisterSuccessfulEntity,
  UserEntity,
} from './entities/auth.entity';
import { RegisterDTO } from './dto/register.dto';
import { LogsTrapService } from '@logstrap/nest';

@Injectable()
export class AuthService {
  constructor(
    protected configService: ConfigService,
    private readonly logger: LogsTrapService,
  ) {}
  async login(body: LoginDTO) {
    const { email, password } = body;
    this.logger.log(`Login attempt initiated`);
    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });
    if (!user) {
      this.logger.warn(`No user found for given email`);
      throw new HttpException(
        'No user found with given email',
        HttpStatus.NOT_FOUND,
      );
    }
    this.logger.log(`User found for given email`);
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
    this.logger.warn(`Incorrect Login password`);
    throw new HttpException(
      'Incorrect email or password',
      HttpStatus.UNAUTHORIZED,
    );
  }

  async register(body: RegisterDTO) {
    const { email, name, password } = body;
    this.logger.log(`Register attempt for: ${name}`);
    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });
    if (user) {
      this.logger.warn(`email already taken`);
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
        id: newUser.id,
      },
      this.configService.getOrThrow('JWT_SECRET'),
      {
        expiresIn: '30 days',
      },
    );
    this.logger.log('Generated Token.');
    return plainToInstance(RegisterSuccessfulEntity, { user: newUser, token });
  }

  async hydrate(token: string) {
    [token] = token.split(' ');
    try {
      const { id } = verify(
        token,
        this.configService.getOrThrow('JWT_SECRET'),
      ) as { id: string };
      const user = await db.query.users.findFirst({
        where: eq(users.id, id),
      });

      if (!user) {
        this.logger.warn(`No user found with token: ${token}`);
        throw new HttpException('No user found', HttpStatus.NOT_FOUND);
      }
      this.logger.log(`Found user with id: ${user.id}`);
      return plainToInstance(UserEntity, user);
    } catch (e) {
      if (e instanceof HttpException) {
        throw new HttpException(e.message, e.getStatus());
      }
      throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
