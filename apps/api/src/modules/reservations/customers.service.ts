import { ConflictException, Injectable } from '@nestjs/common';
import type {
  CreateCustomerRequestDto,
  CreateCustomerResponseDto,
  CustomerSearchResponseDto,
} from '@courtlane/contracts';
import { prisma } from '@courtlane/db';
import { Prisma } from '@prisma/client';

@Injectable()
export class CustomersService {
  async searchCustomers(
    accountId: number,
    query: string,
  ): Promise<CustomerSearchResponseDto> {
    const customers = await prisma.customer.findMany({
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

    return { customers };
  }

  async createCustomer(
    accountId: number,
    input: CreateCustomerRequestDto,
  ): Promise<CreateCustomerResponseDto> {
    try {
      const customer = await prisma.customer.create({
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
      });

      return { customer };
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          'A customer with that email already exists in this account.',
        );
      }

      throw error;
    }
  }
}
