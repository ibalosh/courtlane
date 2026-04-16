import { Injectable } from '@nestjs/common';
import { prisma } from '@courtlane/db';
import { AuthUserDto } from '@courtlane/contracts';

const SESSION_DURATION_MS = 1000 * 60 * 60 * 24 * 30;

@Injectable()
export class SessionService {
  async create(userId: string) {
    const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);

    return prisma.session.create({
      data: {
        userId,
        expiresAt,
      },
      select: {
        id: true,
        expiresAt: true,
      },
    });
  }

  async getUser(sessionId: string): Promise<AuthUserDto | null> {
    const session = await prisma.session.findFirst({
      where: {
        id: sessionId,
        expiresAt: {
          gt: new Date(),
        },
      },
      select: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });

    return session?.user ?? null;
  }

  async delete(sessionId: string): Promise<void> {
    await prisma.session.deleteMany({
      where: {
        id: sessionId,
      },
    });
  }
}
