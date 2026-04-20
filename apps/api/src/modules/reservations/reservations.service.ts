import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import type {
  CreateReservationRequestDto,
  ReservationResponseDto,
  UpdateReservationRequestDto,
  WeekScheduleResponseDto,
} from '@courtlane/contracts';
import { createReservationWeekDays, createReservationWeekRange, formatReservationDate } from './reservation-week.utils';
import {
  createReservationSlots,
  getReservationSlotEndDate,
  isValidReservationSlotStart,
} from './reservation-slot.utils';
import {
  createReservation,
  deleteReservationForAccount,
  findCourtForAccount,
  findCustomerForAccount,
  findReservationForAccount,
  listCourtsForWeek,
  listReservationsForWeek,
  updateReservationCustomer,
} from './reservations.db';

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
      findCourtForAccount(accountId, input.courtId),
      findCustomerForAccount(accountId, input.customerId),
    ]);

    if (!court) {
      throw new NotFoundException('Court not found.');
    }

    if (!customer) {
      throw new NotFoundException('Customer not found.');
    }

    const reservation = await createReservation({
      accountId,
      courtId: input.courtId,
      customerId: input.customerId,
      startsAt,
      endsAt: getReservationSlotEndDate(startsAt),
    });

    return this.toReservationResponse(reservation);
  }

  async updateReservation(
    accountId: number,
    reservationId: number,
    input: UpdateReservationRequestDto,
  ): Promise<ReservationResponseDto['reservation']> {
    const [reservation, customer] = await Promise.all([
      findReservationForAccount(accountId, reservationId),
      findCustomerForAccount(accountId, input.customerId),
    ]);

    if (!reservation) {
      throw new NotFoundException('Reservation not found.');
    }

    if (!customer) {
      throw new NotFoundException('Customer not found.');
    }

    const updatedReservation = await updateReservationCustomer(reservationId, input.customerId);

    return this.toReservationResponse(updatedReservation);
  }

  async clearReservation(accountId: number, reservationId: number): Promise<void> {
    const deleted = await deleteReservationForAccount(accountId, reservationId);

    if (deleted.count === 0) {
      throw new NotFoundException('Reservation not found.');
    }
  }

  async getWeekSchedule(accountId: number, startDate: string): Promise<WeekScheduleResponseDto> {
    const { weekStart, weekEnd, nextWeekStart } = createReservationWeekRange(startDate);

    const [courts, reservations] = await Promise.all([
      listCourtsForWeek(accountId),
      listReservationsForWeek(accountId, weekStart, nextWeekStart),
    ]);

    return {
      week: {
        start: formatReservationDate(weekStart),
        end: formatReservationDate(weekEnd),
        days: createReservationWeekDays(weekStart),
      },
      courts,
      slots: createReservationSlots(),
      reservations: reservations.map((reservation) => this.toReservationResponse(reservation)),
    };
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
