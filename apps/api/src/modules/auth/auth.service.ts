import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto, LogoutResponseDto, SignupDto, UpdateProfileDto } from '@courtlane/contracts';
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

    const user = await prisma.$transaction(async (tx) => {
      const account = await tx.account.create({
        data: {
          name: this.createDefaultAccountName(input.name),
        },
        select: {
          id: true,
        },
      });

      await tx.court.create({
        data: {
          accountId: account.id,
          name: 'Court',
          sortOrder: 1,
        },
      });

      const createdUser = await tx.user.create({
        data: {
          accountId: account.id,
          email: input.email,
          name: input.name,
          passwordHash,
        },
        select: {
          id: true,
          accountId: true,
          email: true,
          name: true,
        },
      });

      return createdUser;
    });

    const session = await this.sessionService.create(user.id);

    return {
      user,
      sessionId: session.token,
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
        accountId: true,
        email: true,
        name: true,
        passwordHash: true,
      },
    });

    const invalidLoginError = new UnauthorizedException('Invalid credentials.');

    if (!user) {
      throw invalidLoginError;
    }

    const isPasswordValid = await argon2.verify(user.passwordHash, input.password);

    if (!isPasswordValid) {
      throw invalidLoginError;
    }

    const session = await this.sessionService.create(user.id);
    const authUser = {
      id: user.id,
      accountId: user.accountId,
      email: user.email,
      name: user.name,
    };

    return {
      user: authUser,
      sessionId: session.token,
      sessionExpiresAt: session.expiresAt,
    };
  }

  async logout(sessionId: string | null): Promise<LogoutResponseDto> {
    if (sessionId) {
      await this.sessionService.delete(sessionId);
    }

    return { ok: true };
  }

  async updateProfile(userId: number, input: UpdateProfileDto) {
    const currentUser = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        accountId: true,
        email: true,
        passwordHash: true,
      },
    });

    if (!currentUser) {
      throw new UnauthorizedException('Authentication required.');
    }

    if (input.email !== currentUser.email) {
      const existingUser = await prisma.user.findUnique({
        where: {
          email: input.email,
        },
        select: {
          id: true,
        },
      });

      if (existingUser) {
        throw new ConflictException('Email is already registered.');
      }
    }

    let passwordHash: string | undefined;

    if (input.currentPassword && input.newPassword) {
      const isPasswordValid = await argon2.verify(currentUser.passwordHash, input.currentPassword);

      if (!isPasswordValid) {
        throw new UnauthorizedException('Current password is incorrect.');
      }

      passwordHash = await argon2.hash(input.newPassword);
    }

    return prisma.user.update({
      where: {
        id: currentUser.id,
      },
      data: {
        email: input.email,
        name: input.name,
        passwordHash,
      },
      select: {
        id: true,
        accountId: true,
        email: true,
        name: true,
      },
    });
  }

  private createDefaultAccountName(name: string) {
    return `${name}'s Account`;
  }
}
