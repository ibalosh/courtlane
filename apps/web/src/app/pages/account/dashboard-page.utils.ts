import type { WeekScheduleResponse } from '../../api/reservations';

export function getWeekScheduleQueryKey(weekStart: string) {
  return ['reservations', 'week', weekStart] as const;
}

export function createReservationMap(schedule?: WeekScheduleResponse) {
  const entries = schedule?.reservations.map((reservation) => [
    `${getReservationDayKey(reservation.startsAt)}:${getReservationSlotKey(reservation.startsAt)}:${reservation.courtId}`,
    reservation,
  ]);

  return new Map(entries);
}

export function createSlotDateTime(date: string, startTime: string) {
  return `${date}T${startTime}:00.000Z`;
}

export function getCurrentWeekStartDateString() {
  const today = new Date();
  const utcDate = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()));
  const utcDay = utcDate.getUTCDay();
  const diff = utcDay === 0 ? -6 : 1 - utcDay;

  utcDate.setUTCDate(utcDate.getUTCDate() + diff);

  return utcDate.toISOString().slice(0, 10);
}

export function shiftDateString(dateString: string, amount: number) {
  const date = new Date(`${dateString}T00:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + amount);
  return date.toISOString().slice(0, 10);
}

export function formatWeekLabel(weekStart: string, weekEnd: string) {
  const formatter = new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'short',
    timeZone: 'UTC',
  });

  return `${formatter.format(new Date(`${weekStart}T00:00:00.000Z`))} - ${formatter.format(new Date(`${weekEnd}T00:00:00.000Z`))}`;
}

export function formatSlotRange(startMinutes: number, endMinutes: number) {
  return `${formatTimeLabel(startMinutes)} - ${formatTimeLabel(endMinutes)}`;
}

function getReservationDayKey(startsAt: string) {
  return startsAt.slice(0, 10);
}

function getReservationSlotKey(startsAt: string) {
  const date = new Date(startsAt);
  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');

  return `${hours}:${minutes}`;
}

function formatTimeLabel(totalMinutes: number) {
  if (totalMinutes === 24 * 60) {
    return '12:00 AM';
  }

  const hours = Math.floor(totalMinutes / 60) % 24;
  const minutes = totalMinutes % 60;
  const suffix = hours >= 12 ? 'PM' : 'AM';
  const hour12 = hours % 12 || 12;

  return `${hour12}:${String(minutes).padStart(2, '0')} ${suffix}`;
}
