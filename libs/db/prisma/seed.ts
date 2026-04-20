import { config } from 'dotenv';
import argon2 from 'argon2';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

config({ path: '../../.env' });

const connectionString = process.env['DATABASE_URL'];

if (!connectionString) {
  throw new Error('DATABASE_URL is required to run the seed script.');
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const TEST_USER = {
  email: 'igor@test.com',
  name: 'Igor Balos',
  password: 'password123',
};

const DEFAULT_COURTS = ['Court 1', 'Court 2', 'Court 3'] as const;

async function main() {
  const passwordHash = await argon2.hash(TEST_USER.password);
  const existingUser = await prisma.user.findUnique({
    where: {
      email: TEST_USER.email,
    },
    select: {
      id: true,
      accountId: true,
    },
  });

  const accountId = existingUser
    ? existingUser.accountId
    : (
        await prisma.account.create({
          data: {
            name: 'Demo Account',
            users: {
              create: {
                email: TEST_USER.email,
                name: TEST_USER.name,
                passwordHash,
              },
            },
          },
          select: {
            id: true,
          },
        })
      ).id;

  if (existingUser) {
    await prisma.user.update({
      where: {
        id: existingUser.id,
      },
      data: {
        name: TEST_USER.name,
        passwordHash,
      },
    });
  }

  await Promise.all(
    DEFAULT_COURTS.map((name, index) =>
      prisma.court.upsert({
        where: {
          accountId_name: {
            accountId,
            name,
          },
        },
        update: {
          sortOrder: index + 1,
          isActive: true,
        },
        create: {
          accountId,
          name,
          sortOrder: index + 1,
        },
      }),
    ),
  );

  console.log(`Seeded demo account for ${TEST_USER.email} with ${DEFAULT_COURTS.length} courts.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
