import { z } from 'zod';

export const weekScheduleQuerySchema = z.object({
  start: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export const reservationCourtSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1).max(100),
  sortOrder: z.number().int().nonnegative(),
});

export const reservationCustomerSummarySchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1).max(255),
  email: z.email().trim().min(1).max(255).nullable(),
});

export const reservationDaySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  label: z.string().min(1).max(32),
});

export const reservationWeekSchema = z.object({
  start: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  end: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  days: z.array(reservationDaySchema).length(7),
});

export const reservationSlotSchema = z.object({
  startTime: z.string().min(1).max(16),
  label: z.string().min(1).max(32),
  startMinutes: z
    .number()
    .int()
    .min(0)
    .max(24 * 60),
  endMinutes: z
    .number()
    .int()
    .min(0)
    .max(24 * 60),
});

export const reservationScheduleItemSchema = z.object({
  id: z.number().int().positive(),
  courtId: z.number().int().positive(),
  customer: reservationCustomerSummarySchema,
  startsAt: z.iso.datetime(),
  endsAt: z.iso.datetime(),
});

export const customerSchema = reservationCustomerSummarySchema.extend({
  phone: z.string().trim().min(1).max(50).nullable(),
});

export const customerSearchQuerySchema = z.object({
  query: z.string().trim().min(1).max(255),
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

export const weekScheduleResponseSchema = z.object({
  week: reservationWeekSchema,
  courts: z.array(reservationCourtSchema),
  slots: z.array(reservationSlotSchema),
  reservations: z.array(reservationScheduleItemSchema),
});

export const createReservationRequestSchema = z.object({
  courtId: z.number().int().positive(),
  customerId: z.number().int().positive(),
  startsAt: z.iso.datetime(),
});

export const reservationIdParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const updateReservationRequestSchema = z.object({
  customerId: z.number().int().positive(),
});

export const reservationResponseSchema = z.object({
  reservation: reservationScheduleItemSchema,
});

export const clearReservationResponseSchema = z.object({
  ok: z.literal(true),
});

export type WeekScheduleQueryDto = z.infer<typeof weekScheduleQuerySchema>;
export type CustomerSearchQueryDto = z.infer<typeof customerSearchQuerySchema>;
export type ReservationCourtDto = z.infer<typeof reservationCourtSchema>;
export type ReservationCustomerSummaryDto = z.infer<typeof reservationCustomerSummarySchema>;
export type CustomerDto = z.infer<typeof customerSchema>;
export type ReservationDayDto = z.infer<typeof reservationDaySchema>;
export type ReservationWeekDto = z.infer<typeof reservationWeekSchema>;
export type ReservationSlotDto = z.infer<typeof reservationSlotSchema>;
export type ReservationScheduleItemDto = z.infer<typeof reservationScheduleItemSchema>;
export type CustomerSearchResponseDto = z.infer<typeof customerSearchResponseSchema>;
export type CreateCustomerRequestDto = z.infer<typeof createCustomerRequestSchema>;
export type CreateCustomerResponseDto = z.infer<typeof createCustomerResponseSchema>;
export type WeekScheduleResponseDto = z.infer<typeof weekScheduleResponseSchema>;
export type CreateReservationRequestDto = z.infer<typeof createReservationRequestSchema>;
export type ReservationIdParamsDto = z.infer<typeof reservationIdParamsSchema>;
export type UpdateReservationRequestDto = z.infer<typeof updateReservationRequestSchema>;
export type ReservationResponseDto = z.infer<typeof reservationResponseSchema>;
export type ClearReservationResponseDto = z.infer<typeof clearReservationResponseSchema>;
