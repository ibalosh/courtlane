import { z } from 'zod';

export const reservationCustomerSummarySchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1).max(255),
  email: z.email().trim().min(1).max(255).nullable(),
});

export const customerSchema = reservationCustomerSummarySchema.extend({
  phone: z.string().trim().min(1).max(50).nullable(),
});

export const customerSearchQuerySchema = z.object({
  query: z.string().trim().min(1).max(255),
});

export const customerListResponseSchema = z.object({
  customers: z.array(customerSchema),
});

export const customerSearchResponseSchema = z.object({
  customers: z.array(customerSchema),
});

export const createCustomerRequestSchema = z.object({
  name: z.string().trim().min(1).max(255),
  email: z.email().trim().min(1).max(255).nullable().optional(),
  phone: z.string().trim().min(1).max(50).nullable().optional(),
});

export const createCustomerResponseSchema = z.object({
  customer: customerSchema,
});

export const customerIdParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const updateCustomerRequestSchema = z.object({
  name: z.string().trim().min(1).max(255),
  email: z.email().trim().min(1).max(255).nullable().optional(),
  phone: z.string().trim().min(1).max(50).nullable().optional(),
});

export const updateCustomerResponseSchema = z.object({
  customer: customerSchema,
});

export const deleteCustomerResponseSchema = z.object({
  ok: z.literal(true),
});

export type CustomerSearchQueryDto = z.infer<typeof customerSearchQuerySchema>;
export type ReservationCustomerSummaryDto = z.infer<typeof reservationCustomerSummarySchema>;
export type CustomerDto = z.infer<typeof customerSchema>;
export type CustomerListResponseDto = z.infer<typeof customerListResponseSchema>;
export type CustomerSearchResponseDto = z.infer<typeof customerSearchResponseSchema>;
export type CreateCustomerRequestDto = z.infer<typeof createCustomerRequestSchema>;
export type CreateCustomerResponseDto = z.infer<typeof createCustomerResponseSchema>;
export type CustomerIdParamsDto = z.infer<typeof customerIdParamsSchema>;
export type UpdateCustomerRequestDto = z.infer<typeof updateCustomerRequestSchema>;
export type UpdateCustomerResponseDto = z.infer<typeof updateCustomerResponseSchema>;
export type DeleteCustomerResponseDto = z.infer<typeof deleteCustomerResponseSchema>;
