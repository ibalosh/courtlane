import { ConflictException, Injectable } from '@nestjs/common';
import type {
  CreateCustomerRequestDto,
  CreateCustomerResponseDto,
  CustomerSearchResponseDto,
  WeekScheduleResponseDto,
} from '@courtlane/contracts';
import {
  createCustomerResponseSchema,
  customerSearchResponseSchema,
  weekScheduleResponseSchema,
} from '@courtlane/contracts';
import { prisma } from '@courtlane/db';
import { Prisma } from '@prisma/client';
import {
  createReservationWeekDays,
  createReservationWeekRange,
  formatReservationDate,
} from './reservation-week.utils';
import { createReservationSlots } from './reservation-slot.utils';

@Injectable()
export class ReservationsService {
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

    return customerSearchResponseSchema.parse({
      customers,
    });
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

      return createCustomerResponseSchema.parse({
        customer,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException(
          'A customer with that email already exists in this account.',
        );
      }

      throw error;
    }
  }

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
