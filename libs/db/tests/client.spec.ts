import { beforeEach, describe, expect, it, vi } from 'vitest';

const prismaClientMock = vi.fn();
const prismaPgMock = vi.fn();

vi.mock('@prisma/adapter-pg', () => ({
  PrismaPg: prismaPgMock,
}));

vi.mock('@prisma/client', () => ({
  PrismaClient: prismaClientMock,
}));

describe('database client', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.unstubAllEnvs();
  });

  it('loads when the database URL is configured', async () => {
    vi.stubEnv('DATABASE_URL', 'postgres-db-url');

    const { prisma } = await import('../src/client');

    expect(prisma).toBeDefined();
  });

  it('fails clearly when the database URL is missing', async () => {
    vi.stubEnv('DATABASE_URL', '');

    await expect(import('../src/client')).rejects.toThrow(
      'DATABASE_URL is required to create the Prisma client.',
    );
  });
});
