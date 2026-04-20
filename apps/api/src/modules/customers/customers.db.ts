import { ConflictException } from '@nestjs/common';
import type { CreateCustomerRequestDto, UpdateCustomerRequestDto } from '@courtlane/contracts';
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

export function listCustomers(accountId: number) {
  return prisma.customer.findMany({
    where: {
      accountId,
    },
    orderBy: {
      name: 'asc',
    },
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

export function findCustomerForAccount(accountId: number, customerId: number) {
  return prisma.customer.findFirst({
    where: {
      id: customerId,
      accountId,
    },
    select: {
      id: true,
    },
  });
}

export function countReservationsForCustomer(accountId: number, customerId: number) {
  return prisma.reservation.count({
    where: {
      accountId,
      customerId,
    },
  });
}

export function updateCustomer(customerId: number, input: UpdateCustomerRequestDto) {
  return prisma.customer
    .update({
      where: {
        id: customerId,
      },
      data: {
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

export function deleteCustomer(customerId: number) {
  return prisma.customer.delete({
    where: {
      id: customerId,
    },
  });
}
