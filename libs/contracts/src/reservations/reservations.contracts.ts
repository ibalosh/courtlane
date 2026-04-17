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

export const weekScheduleResponseSchema = z.object({
  week: reservationWeekSchema,
  courts: z.array(reservationCourtSchema),
  slots: z.array(reservationSlotSchema),
  reservations: z.array(reservationScheduleItemSchema),
});

export type WeekScheduleQueryDto = z.infer<typeof weekScheduleQuerySchema>;
export type ReservationCourtDto = z.infer<typeof reservationCourtSchema>;
export type ReservationCustomerSummaryDto = z.infer<
  typeof reservationCustomerSummarySchema
>;
export type ReservationDayDto = z.infer<typeof reservationDaySchema>;
export type ReservationWeekDto = z.infer<typeof reservationWeekSchema>;
export type ReservationSlotDto = z.infer<typeof reservationSlotSchema>;
export type ReservationScheduleItemDto = z.infer<
  typeof reservationScheduleItemSchema
>;
export type WeekScheduleResponseDto = z.infer<
  typeof weekScheduleResponseSchema
>;
