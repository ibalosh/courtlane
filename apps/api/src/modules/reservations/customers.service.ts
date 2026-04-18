import { Injectable } from '@nestjs/common';
import type {
  CreateCustomerRequestDto,
  CreateCustomerResponseDto,
  CustomerSearchResponseDto,
} from '@courtlane/contracts';
import { createCustomer, searchCustomers } from './customers.db';

@Injectable()
export class CustomersService {
  async searchCustomers(
    accountId: number,
    query: string,
  ): Promise<CustomerSearchResponseDto> {
    const customers = await searchCustomers(accountId, query);

    return { customers };
  }

  async createCustomer(
    accountId: number,
    input: CreateCustomerRequestDto,
  ): Promise<CreateCustomerResponseDto> {
    const customer = await createCustomer(accountId, input);

    return { customer };
  }
}
