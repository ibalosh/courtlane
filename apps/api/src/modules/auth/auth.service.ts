import { ConflictException, Injectable } from '@nestjs/common';
import { AuthResponse, SignupRequest } from '@courtlane/contracts';
import { prisma } from '@courtlane/db';
import { hash } from 'argon2';

@Injectable()
export class AuthService {
  async signup(input: SignupRequest): Promise<AuthResponse> {
    const existingUser = await prisma.user.findUnique({
      where: {
        email: input.email,
      },
    });

    if (existingUser) {
      throw new ConflictException('Email is already registered.');
    }

    const passwordHash = await hash(input.password);

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

    return { user };
  }
}
