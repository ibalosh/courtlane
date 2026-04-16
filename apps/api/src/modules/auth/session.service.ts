import { Injectable } from '@nestjs/common';
import { prisma } from '@courtlane/db';
import { AuthUserDto } from '@courtlane/contracts';
import { createHash, randomBytes } from 'crypto';

const SESSION_DURATION_MS = 1000 * 60 * 60 * 24 * 30;

function generateSessionToken() {
  return randomBytes(32).toString('base64url');
}

function hashSessionToken(sessionToken: string) {
  return createHash('sha256').update(sessionToken).digest('hex');
}

@Injectable()
export class SessionService {
  async create(userId: number) {
    const sessionToken = generateSessionToken();
    const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);

    return prisma.session
      .create({
        data: {
          tokenHash: hashSessionToken(sessionToken),
          userId,
          expiresAt,
        },
        select: {
          expiresAt: true,
        },
      })
      .then((session) => ({
        token: sessionToken,
        expiresAt: session.expiresAt,
      }));
  }

  async getUser(sessionToken: string): Promise<AuthUserDto | null> {
    const session = await prisma.session.findUnique({
      where: {
        tokenHash: hashSessionToken(sessionToken),
      },
      select: {
        expiresAt: true,
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });

    if (!session || session.expiresAt <= new Date()) {
      return null;
    }

    return session?.user ?? null;
  }

  async delete(sessionToken: string): Promise<void> {
    await prisma.session.deleteMany({
      where: {
        tokenHash: hashSessionToken(sessionToken),
      },
    });
  }
}
