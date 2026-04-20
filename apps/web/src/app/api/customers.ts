import type {
  CreateCustomerRequestDto,
  CreateCustomerResponseDto,
  CustomerSearchQueryDto,
  CustomerSearchResponseDto,
} from '@courtlane/contracts';
import { request } from './client';

export type {
  CreateCustomerRequestDto as CreateCustomerInput,
  CreateCustomerResponseDto as CreateCustomerResponse,
  CustomerSearchQueryDto as CustomerSearchQuery,
  CustomerSearchResponseDto as CustomerSearchResponse,
};

export function searchCustomers(query: CustomerSearchQueryDto): Promise<CustomerSearchResponseDto> {
  const search = new URLSearchParams({
    query: query.query,
  });

  return request<CustomerSearchResponseDto>(`/customers?${search.toString()}`);
}

export function createCustomer(input: CreateCustomerRequestDto): Promise<CreateCustomerResponseDto> {
  return request<CreateCustomerResponseDto>('/customers', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}
