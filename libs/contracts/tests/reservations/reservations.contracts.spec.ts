import {
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
});
