import type {
  CreateCustomerRequestDto,
  CreateCustomerResponseDto,
  CustomerListResponseDto,
  CustomerSearchQueryDto,
  CustomerSearchResponseDto,
  DeleteCustomerResponseDto,
  UpdateCustomerRequestDto,
  UpdateCustomerResponseDto,
} from '@courtlane/contracts';
import { request } from './client';

export type {
  CreateCustomerRequestDto as CreateCustomerInput,
  CreateCustomerResponseDto as CreateCustomerResponse,
  CustomerListResponseDto as CustomerListResponse,
  CustomerSearchQueryDto as CustomerSearchQuery,
  CustomerSearchResponseDto as CustomerSearchResponse,
  DeleteCustomerResponseDto as DeleteCustomerResponse,
  UpdateCustomerRequestDto as UpdateCustomerInput,
  UpdateCustomerResponseDto as UpdateCustomerResponse,
};

export function getCustomers(): Promise<CustomerListResponseDto> {
  return request<CustomerListResponseDto>('/customers');
}

export function searchCustomers(query: CustomerSearchQueryDto): Promise<CustomerSearchResponseDto> {
  const search = new URLSearchParams({
    query: query.query,
  });

  return request<CustomerSearchResponseDto>(`/customers/search?${search.toString()}`);
}

export function createCustomer(input: CreateCustomerRequestDto): Promise<CreateCustomerResponseDto> {
  return request<CreateCustomerResponseDto>('/customers', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export function updateCustomer(id: number, input: UpdateCustomerRequestDto): Promise<UpdateCustomerResponseDto> {
  return request<UpdateCustomerResponseDto>(`/customers/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(input),
  });
}

export function deleteCustomer(id: number): Promise<DeleteCustomerResponseDto> {
  return request<DeleteCustomerResponseDto>(`/customers/${id}`, {
    method: 'DELETE',
  });
}
