import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import type {
  CreateCustomerRequestDto,
  CreateCustomerResponseDto,
  CustomerListResponseDto,
  CustomerSearchResponseDto,
  DeleteCustomerResponseDto,
  UpdateCustomerRequestDto,
  UpdateCustomerResponseDto,
} from '@courtlane/contracts';
import { Prisma } from '@prisma/client';
import {
  countReservationsForCustomer,
  createCustomer,
  deleteCustomer,
  findCustomerForAccount,
  listCustomers,
  searchCustomers,
  updateCustomer,
} from './customers.db';

@Injectable()
export class CustomersService {
  async listCustomers(accountId: number): Promise<CustomerListResponseDto> {
    const customers = await listCustomers(accountId);

    return { customers };
  }

  async searchCustomers(accountId: number, query: string): Promise<CustomerSearchResponseDto> {
    const customers = await searchCustomers(accountId, query);

    return { customers };
  }

  async createCustomer(accountId: number, input: CreateCustomerRequestDto): Promise<CreateCustomerResponseDto> {
    const customer = await createCustomer(accountId, input);

    return { customer };
  }

  async updateCustomer(
    accountId: number,
    customerId: number,
    input: UpdateCustomerRequestDto,
  ): Promise<UpdateCustomerResponseDto> {
    const customer = await findCustomerForAccount(accountId, customerId);

    if (!customer) {
      throw new NotFoundException('Customer not found.');
    }

    return { customer: await updateCustomer(customerId, input) };
  }

  async deleteCustomer(accountId: number, customerId: number): Promise<DeleteCustomerResponseDto> {
    const customer = await findCustomerForAccount(accountId, customerId);

    if (!customer) {
      throw new NotFoundException('Customer not found.');
    }

    const reservationCount = await countReservationsForCustomer(accountId, customerId);

    if (reservationCount > 0) {
      throw new ConflictException('This customer has reservations and cannot be deleted.');
    }

    try {
      await deleteCustomer(customerId);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2003') {
        throw new ConflictException('This customer has reservations and cannot be deleted.');
      }

      throw error;
    }

    return { ok: true };
  }
}
