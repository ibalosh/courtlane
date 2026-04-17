import {
  clearReservationResponseSchema,
  createCustomerRequestSchema,
  createCustomerResponseSchema,
  createReservationRequestSchema,
  customerSearchQuerySchema,
  customerSearchResponseSchema,
  reservationIdParamsSchema,
  reservationResponseSchema,
  updateReservationRequestSchema,
  weekScheduleQuerySchema,
  weekScheduleResponseSchema,
} from '../../src/reservations/reservations.contracts';

describe('reservation contracts', () => {
  it('validates the week schedule query shape', () => {
    expect(
      weekScheduleQuerySchema.parse({
        start: '2026-04-20',
      }),
    ).toEqual({
      start: '2026-04-20',
    });
  });

  it('rejects invalid week schedule query dates', () => {
    expect(() =>
      weekScheduleQuerySchema.parse({
        start: '20-04-2026',
      }),
    ).toThrow();
  });

  it('validates the week schedule response shape', () => {
    expect(
      weekScheduleResponseSchema.parse({
        week: {
          start: '2026-04-20',
          end: '2026-04-26',
          days: [
            { date: '2026-04-20', label: 'Monday' },
            { date: '2026-04-21', label: 'Tuesday' },
            { date: '2026-04-22', label: 'Wednesday' },
            { date: '2026-04-23', label: 'Thursday' },
            { date: '2026-04-24', label: 'Friday' },
            { date: '2026-04-25', label: 'Saturday' },
            { date: '2026-04-26', label: 'Sunday' },
          ],
        },
        courts: [
          {
            id: 1,
            name: 'Court 1',
            sortOrder: 1,
          },
        ],
        slots: [
          {
            startTime: '09:00',
            label: '9:00 AM',
            startMinutes: 540,
            endMinutes: 585,
          },
        ],
        reservations: [
          {
            id: 1,
            courtId: 1,
            customer: {
              id: 10,
              name: 'John Smith',
              email: 'john@example.com',
            },
            startsAt: '2026-04-20T09:00:00.000Z',
            endsAt: '2026-04-20T09:45:00.000Z',
          },
        ],
      }),
    ).toMatchObject({
      week: {
        start: '2026-04-20',
        end: '2026-04-26',
      },
    });
  });

  it('validates customer lookup and create shapes', () => {
    expect(
      customerSearchQuerySchema.parse({
        query: 'john',
      }),
    ).toEqual({
      query: 'john',
    });

    expect(
      createCustomerRequestSchema.parse({
        name: 'John Smith',
        email: 'john@example.com',
        phone: '+381600000000',
      }),
    ).toEqual({
      name: 'John Smith',
      email: 'john@example.com',
      phone: '+381600000000',
    });

    expect(
      customerSearchResponseSchema.parse({
        customers: [
          {
            id: 1,
            name: 'John Smith',
            email: 'john@example.com',
            phone: '+381600000000',
          },
        ],
      }),
    ).toMatchObject({
      customers: [
        {
          id: 1,
          name: 'John Smith',
        },
      ],
    });

    expect(
      createCustomerResponseSchema.parse({
        customer: {
          id: 1,
          name: 'John Smith',
          email: 'john@example.com',
          phone: '+381600000000',
        },
      }),
    ).toMatchObject({
      customer: {
        id: 1,
        name: 'John Smith',
      },
    });
  });

  it('validates reservation mutation shapes', () => {
    expect(
      createReservationRequestSchema.parse({
        courtId: 1,
        customerId: 10,
        startsAt: '2026-04-20T09:00:00.000Z',
      }),
    ).toEqual({
      courtId: 1,
      customerId: 10,
      startsAt: '2026-04-20T09:00:00.000Z',
    });

    expect(
      reservationIdParamsSchema.parse({
        reservationId: '25',
      }),
    ).toEqual({
      reservationId: 25,
    });

    expect(
      updateReservationRequestSchema.parse({
        customerId: 12,
      }),
    ).toEqual({
      customerId: 12,
    });

    expect(
      reservationResponseSchema.parse({
        reservation: {
          id: 25,
          courtId: 1,
          customer: {
            id: 12,
            name: 'Jane Smith',
            email: 'jane@example.com',
          },
          startsAt: '2026-04-20T09:00:00.000Z',
          endsAt: '2026-04-20T09:45:00.000Z',
        },
      }),
    ).toMatchObject({
      reservation: {
        id: 25,
        courtId: 1,
      },
    });

    expect(
      clearReservationResponseSchema.parse({
        ok: true,
      }),
    ).toEqual({
      ok: true,
    });
  });
});
