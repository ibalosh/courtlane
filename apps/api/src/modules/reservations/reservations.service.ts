import { Injectable } from '@nestjs/common';
import type { WeekScheduleResponseDto } from '@courtlane/contracts';
import { weekScheduleResponseSchema } from '@courtlane/contracts';
import { prisma } from '@courtlane/db';
import {
  createReservationWeekDays,
  createReservationWeekRange,
  formatReservationDate,
} from './reservation-week.utils';
import { createReservationSlots } from './reservation-slot.utils';

@Injectable()
export class ReservationsService {
  async getWeekSchedule(
    accountId: number,
    startDate: string,
  ): Promise<WeekScheduleResponseDto> {
    const { weekStart, weekEnd, nextWeekStart } =
      createReservationWeekRange(startDate);

    const [courts, reservations] = await Promise.all([
      prisma.court.findMany({
        where: {
          accountId,
          isActive: true,
        },
        orderBy: {
          sortOrder: 'asc',
        },
        select: {
          id: true,
          name: true,
          sortOrder: true,
        },
      }),
      prisma.reservation.findMany({
        where: {
          accountId,
          startsAt: {
            gte: weekStart,
            lt: nextWeekStart,
          },
          court: {
            isActive: true,
          },
        },
        orderBy: {
          startsAt: 'asc',
        },
        select: {
          id: true,
          courtId: true,
          startsAt: true,
          endsAt: true,
          customer: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      }),
    ]);

    return weekScheduleResponseSchema.parse({
      week: {
        start: formatReservationDate(weekStart),
        end: formatReservationDate(weekEnd),
        days: createReservationWeekDays(weekStart),
      },
      courts,
      slots: createReservationSlots(),
      reservations: reservations.map((reservation) => ({
        id: reservation.id,
        courtId: reservation.courtId,
        customer: reservation.customer,
        startsAt: reservation.startsAt.toISOString(),
        endsAt: reservation.endsAt.toISOString(),
      })),
    });
  }
}
