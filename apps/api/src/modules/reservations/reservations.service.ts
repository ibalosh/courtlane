import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type {
  CreateReservationRequestDto,
  ReservationResponseDto,
  UpdateReservationRequestDto,
  WeekScheduleResponseDto,
} from '@courtlane/contracts';
import { weekScheduleResponseSchema } from '@courtlane/contracts';
import { prisma } from '@courtlane/db';
import { Prisma } from '@prisma/client';
import {
  createReservationWeekDays,
  createReservationWeekRange,
  formatReservationDate,
} from './reservation-week.utils';
import {
  createReservationSlots,
  getReservationSlotEndDate,
  isValidReservationSlotStart,
} from './reservation-slot.utils';

@Injectable()
export class ReservationsService {
  async createReservation(
    accountId: number,
    input: CreateReservationRequestDto,
  ): Promise<ReservationResponseDto['reservation']> {
    const startsAt = new Date(input.startsAt);

    if (!isValidReservationSlotStart(startsAt)) {
      throw new ConflictException('Invalid reservation slot start time.');
    }

    const [court, customer] = await Promise.all([
      prisma.court.findFirst({
        where: {
          id: input.courtId,
          accountId,
          isActive: true,
        },
        select: {
          id: true,
        },
      }),
      prisma.customer.findFirst({
        where: {
          id: input.customerId,
          accountId,
        },
        select: {
          id: true,
        },
      }),
    ]);

    if (!court) {
      throw new NotFoundException('Court not found.');
    }

    if (!customer) {
      throw new NotFoundException('Customer not found.');
    }

    try {
      const reservation = await prisma.reservation.create({
        data: {
          accountId,
          courtId: input.courtId,
          customerId: input.customerId,
          startsAt,
          endsAt: getReservationSlotEndDate(startsAt),
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
      });

      return this.toReservationResponse(reservation);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('That court slot is already reserved.');
      }

      throw error;
    }
  }

  async updateReservation(
    accountId: number,
    reservationId: number,
    input: UpdateReservationRequestDto,
  ): Promise<ReservationResponseDto['reservation']> {
    const [reservation, customer] = await Promise.all([
      prisma.reservation.findFirst({
        where: {
          id: reservationId,
          accountId,
        },
        select: {
          id: true,
        },
      }),
      prisma.customer.findFirst({
        where: {
          id: input.customerId,
          accountId,
        },
        select: {
          id: true,
        },
      }),
    ]);

    if (!reservation) {
      throw new NotFoundException('Reservation not found.');
    }

    if (!customer) {
      throw new NotFoundException('Customer not found.');
    }

    const updatedReservation = await prisma.reservation.update({
      where: {
        id: reservationId,
      },
      data: {
        customerId: input.customerId,
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
    });

    return this.toReservationResponse(updatedReservation);
  }

  async clearReservation(
    accountId: number,
    reservationId: number,
  ): Promise<void> {
    const deleted = await prisma.reservation.deleteMany({
      where: {
        id: reservationId,
        accountId,
      },
    });

    if (deleted.count === 0) {
      throw new NotFoundException('Reservation not found.');
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
      reservations: reservations.map((reservation) =>
        this.toReservationResponse(reservation),
      ),
    });
  }

  private toReservationResponse(reservation: {
    id: number;
    courtId: number;
    startsAt: Date;
    endsAt: Date;
    customer: {
      id: number;
      name: string;
      email: string | null;
    };
  }): ReservationResponseDto['reservation'] {
    return {
      id: reservation.id,
      courtId: reservation.courtId,
      customer: reservation.customer,
      startsAt: reservation.startsAt.toISOString(),
      endsAt: reservation.endsAt.toISOString(),
    };
  }
}
