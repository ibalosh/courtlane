import { DAY_LABELS } from './reservation-schedule.config';

function parseReservationDate(dateString: string) {
  const date = new Date(`${dateString}T00:00:00.000Z`);

  if (Number.isNaN(date.getTime())) {
    throw new Error(`Invalid date string: ${dateString}`);
  }

  return date;
}

function startOfReservationWeek(date: Date) {
  const normalizedDate = new Date(date);
  const utcDay = normalizedDate.getUTCDay();
  const diff = utcDay === 0 ? -6 : 1 - utcDay;

  normalizedDate.setUTCDate(normalizedDate.getUTCDate() + diff);
  normalizedDate.setUTCHours(0, 0, 0, 0);

  return normalizedDate;
}

function addReservationDays(date: Date, amount: number) {
  const nextDate = new Date(date);
  nextDate.setUTCDate(nextDate.getUTCDate() + amount);
  return nextDate;
}

export function formatReservationDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function createReservationWeekDays(weekStart: Date) {
  return DAY_LABELS.map((label, index) => ({
    date: formatReservationDate(addReservationDays(weekStart, index)),
    label,
  }));
}

export function createReservationWeekRange(dateString: string) {
  const weekStart = startOfReservationWeek(parseReservationDate(dateString));
  const weekEnd = addReservationDays(weekStart, 6);
  const nextWeekStart = addReservationDays(weekStart, 7);

  return {
    weekStart,
    weekEnd,
    nextWeekStart,
  };
}
