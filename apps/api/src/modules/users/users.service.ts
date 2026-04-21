import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UpdateProfileDto } from '@courtlane/contracts';
import { prisma } from '@courtlane/db';
import argon2 from 'argon2';

@Injectable()
export class UsersService {
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

    if (await this.isExistingUser(input.email, currentUser.email)) {
      throw new ConflictException('Email is already registered.');
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

  private async isExistingUser(inputEmail: string, currentUserEmail: string) {
    if (inputEmail !== currentUserEmail) {
      return prisma.user.findUnique({
        where: {
          email: inputEmail,
        },
        select: {
          id: true,
        },
      });
    }
  }
}
