import {
  createReservationWeekDays,
  createReservationWeekRange,
  DAY_END_MINUTES,
  DAY_START_MINUTES,
  SLOT_DURATION_MINUTES,
} from '../../src/modules/reservations/reservation-week.utils';
import { createReservationSlots } from '../../src/modules/reservations/reservation-slot.utils';

describe('reservation schedule utils', () => {
  it('normalizes a date to the monday week range', () => {
    const { weekStart, weekEnd, nextWeekStart } = createReservationWeekRange('2026-04-22');

    expect(weekStart.toISOString()).toBe('2026-04-20T00:00:00.000Z');
    expect(weekEnd.toISOString()).toBe('2026-04-26T00:00:00.000Z');
    expect(nextWeekStart.toISOString()).toBe('2026-04-27T00:00:00.000Z');
  });

  it('creates monday to sunday labels', () => {
    expect(createReservationWeekDays(new Date('2026-04-20T00:00:00.000Z'))).toEqual([
      { date: '2026-04-20', label: 'Monday' },
      { date: '2026-04-21', label: 'Tuesday' },
      { date: '2026-04-22', label: 'Wednesday' },
      { date: '2026-04-23', label: 'Thursday' },
      { date: '2026-04-24', label: 'Friday' },
      { date: '2026-04-25', label: 'Saturday' },
      { date: '2026-04-26', label: 'Sunday' },
    ]);
  });

  it('creates 45 minute slots for the configured business day', () => {
    const slots = createReservationSlots();

    expect(slots[0]).toEqual({
      startTime: '09:00',
      label: '9:00 AM',
      startMinutes: DAY_START_MINUTES,
      endMinutes: DAY_START_MINUTES + SLOT_DURATION_MINUTES,
    });
    expect(slots.at(-1)).toEqual({
      startTime: '23:15',
      label: '11:15 PM',
      startMinutes: DAY_END_MINUTES - SLOT_DURATION_MINUTES,
      endMinutes: DAY_END_MINUTES,
    });
  });
});
