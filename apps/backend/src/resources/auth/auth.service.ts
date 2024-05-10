import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { LoginDTO } from './dto/login.dto';
import { hash, verify } from 'argon2';
import { JwtPayload, sign, verify as verifyJWT } from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { SignupDTO } from './dto/signup.dto';
import { createId } from '@paralleldrive/cuid2';
import { prisma } from 'src/db';

@Injectable()
export class AuthService {
  constructor(private service: ConfigService) {}

  async login(body: LoginDTO) {
    const { password, username } = body;
    const user = await prisma.user.findFirst({
      where: { username: { equals: username, mode: 'insensitive' } },
    });
    if (!user)
      throw new HttpException(
        'No user found with given username.',
        HttpStatus.NOT_FOUND,
      );

    const isPasswordCorrect = await verify(user.password, password);
    if (isPasswordCorrect === false)
      throw new HttpException('Incorrect password', HttpStatus.UNAUTHORIZED);
    const token = sign({ id: user.id }, this.service.get('JWT_SECRET'));
    return {
      token,
      user: {
        name: user.name,
        username: user.username,
        id: user.id,
      },
    };
  }

  async signup(body: SignupDTO) {
    const { username, password, name } = body;
    const existingUser = await prisma.user.findFirst({
      where: { username: { equals: username, mode: 'insensitive' } },
    });

    if (existingUser) {
      throw new HttpException(
        'Username is already taken.',
        HttpStatus.CONFLICT,
      );
    }

    const hashedPassword = await hash(password);
    const newUser = await prisma.user.create({
      data: {
        id: `user_${createId()}`,
        name,
        password: hashedPassword,
        username,
      },
    });
    const token = sign({ id: newUser.id }, this.service.get('JWT_SECRET'));
    return {
      token,
      user: {
        id: newUser.id,
        username,
        name,
      },
    };
  }

  async verify(token: string) {
    try {
      const payload = verifyJWT(token, process.env.JWT_SECRET) as JwtPayload;
      const user = await prisma.user.findFirst({
        where: { id: payload.id },
      });
      if (!user) throw new Error('Unauthorized');
      return user;
    } catch (e) {
      throw Error('Unauthorized');
    }
  }
  async hydrateUser(id: string) {
    const user = await prisma.user.findFirst({
      where: { id },
      select: {
        id: true,
        username: true,
        name: true,
      },
    });
    if (!user) throw new HttpException('No User Found', HttpStatus.NOT_FOUND);
    return user;
  }
}
