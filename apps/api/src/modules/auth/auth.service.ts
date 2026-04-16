import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import {
  LoginDto,
  LogoutResponseDto,
  MeResponseDto,
  SignupDto,
} from '@courtlane/contracts';
import { prisma } from '@courtlane/db';
import argon2 from 'argon2';
import { SessionService } from './session.service';

@Injectable()
export class AuthService {
  constructor(private readonly sessionService: SessionService) {}

  async signup(input: SignupDto) {
    const existingUser = await prisma.user.findUnique({
      where: {
        email: input.email,
      },
    });

    if (existingUser) {
      throw new ConflictException('Email is already registered.');
    }

    const passwordHash = await argon2.hash(input.password);

    const user = await prisma.user.create({
      data: {
        email: input.email,
        name: input.name,
        passwordHash,
      },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    const session = await this.sessionService.create(user.id);

    return {
      user,
      sessionId: session.id,
      sessionExpiresAt: session.expiresAt,
    };
  }

  async login(input: LoginDto) {
    const user = await prisma.user.findUnique({
      where: {
        email: input.email,
      },
      select: {
        id: true,
        email: true,
        name: true,
        passwordHash: true,
      },
    });

    const invalidLoginError = new UnauthorizedException('Invalid credentials.');

    if (!user) {
      throw invalidLoginError;
    }

    const isPasswordValid = await argon2.verify(
      user.passwordHash,
      input.password,
    );

    if (!isPasswordValid) {
      throw invalidLoginError;
    }

    const session = await this.sessionService.create(user.id);
    const authUser = {
      id: user.id,
      email: user.email,
      name: user.name,
    };

    return {
      user: authUser,
      sessionId: session.id,
      sessionExpiresAt: session.expiresAt,
    };
  }

  async me(sessionId: string | null): Promise<MeResponseDto> {
    if (!sessionId) {
      return { user: null };
    }

    const user = await this.sessionService.getUser(sessionId);

    return { user };
  }

  async logout(sessionId: string | null): Promise<LogoutResponseDto> {
    if (sessionId) {
      await this.sessionService.delete(sessionId);
    }

    return { ok: true };
  }
}
