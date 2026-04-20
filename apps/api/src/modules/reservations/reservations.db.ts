import { ConflictException } from '@nestjs/common';
import { prisma } from '@courtlane/db';
import { Prisma } from '@prisma/client';

export function findCourtForAccount(accountId: number, courtId: number) {
  return prisma.court.findFirst({
    where: {
      id: courtId,
      accountId,
      isActive: true,
    },
    select: {
      id: true,
    },
  });
}

export function findCustomerForAccount(accountId: number, customerId: number) {
  return prisma.customer.findFirst({
    where: {
      id: customerId,
      accountId,
    },
    select: {
      id: true,
    },
  });
}

export function createReservation(input: {
  accountId: number;
  courtId: number;
  customerId: number;
  startsAt: Date;
  endsAt: Date;
}) {
  return prisma.reservation
    .create({
      data: input,
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
    })
    .catch((error) => {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('That court slot is already reserved.');
      }

      throw error;
    });
}

export function updateReservationCustomer(reservationId: number, customerId: number) {
  return prisma.reservation.update({
    where: {
      id: reservationId,
    },
    data: {
      customerId,
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
}

export function findReservationForAccount(accountId: number, reservationId: number) {
  return prisma.reservation.findFirst({
    where: {
      id: reservationId,
      accountId,
    },
    select: {
      id: true,
    },
  });
}

export function deleteReservationForAccount(accountId: number, reservationId: number) {
  return prisma.reservation.deleteMany({
    where: {
      id: reservationId,
      accountId,
    },
  });
}

export function listCourtsForWeek(accountId: number) {
  return prisma.court.findMany({
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
  });
}

export function listReservationsForWeek(accountId: number, weekStart: Date, nextWeekStart: Date) {
  return prisma.reservation.findMany({
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
  });
}
