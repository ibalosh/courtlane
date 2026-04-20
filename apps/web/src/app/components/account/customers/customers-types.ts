import type { CustomerDto } from '@courtlane/contracts';

export type Customer = CustomerDto;

export type CustomerDraft = {
  email: string;
  name: string;
  phone: string;
};

export type CreateCustomer = (draft: CustomerDraft) => Promise<void>;
export type UpdateCustomer = (customerId: number, draft: CustomerDraft) => Promise<void>;
export type DeleteCustomer = (customerId: number) => Promise<void>;
