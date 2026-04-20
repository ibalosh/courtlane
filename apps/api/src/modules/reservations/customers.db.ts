import { ConflictException } from '@nestjs/common';
import type { CreateCustomerRequestDto } from '@courtlane/contracts';
import { prisma } from '@courtlane/db';
import { Prisma } from '@prisma/client';

export function searchCustomers(accountId: number, query: string) {
  return prisma.customer.findMany({
    where: {
      accountId,
      OR: [
        {
          name: {
            contains: query,
            mode: 'insensitive',
          },
        },
        {
          email: {
            contains: query,
            mode: 'insensitive',
          },
        },
      ],
    },
    orderBy: {
      name: 'asc',
    },
    take: 10,
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
    },
  });
}

export function createCustomer(accountId: number, input: CreateCustomerRequestDto) {
  return prisma.customer
    .create({
      data: {
        accountId,
        name: input.name,
        email: input.email ?? null,
        phone: input.phone ?? null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
      },
    })
    .catch((error) => {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('A customer with that email already exists in this account.');
      }

      throw error;
    });
}
