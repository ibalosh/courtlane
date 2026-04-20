// Shared date helpers for reservation weeks. This keeps week boundaries, day labels, and date formatting
// consistent anywhere the API needs to build or query a week-based reservation view.

export const DAY_LABELS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const;
export const SLOT_DURATION_MINUTES = 45;
export const DAY_START_MINUTES = 9 * 60;
export const DAY_END_MINUTES = 24 * 60;

// Turns an incoming reservation date string into a real UTC date so the rest of the module can work with one format.
function parseReservationDate(dateString: string) {
  const date = new Date(`${dateString}T00:00:00.000Z`);

  if (Number.isNaN(date.getTime())) {
    throw new Error(`Invalid date string: ${dateString}`);
  }

  return date;
}

// Normalizes any date to the Monday of its reservation week so weekly queries and labels stay consistent.
function startOfReservationWeek(date: Date) {
  const normalizedDate = new Date(date);
  const utcDay = normalizedDate.getUTCDay();
  const diff = utcDay === 0 ? -6 : 1 - utcDay;

  normalizedDate.setUTCDate(normalizedDate.getUTCDate() + diff);
  normalizedDate.setUTCHours(0, 0, 0, 0);

  return normalizedDate;
}

// Moves a reservation date forward or backward by whole days while keeping the same UTC-based date handling.
function addReservationDays(date: Date, amount: number) {
  const nextDate = new Date(date);
  nextDate.setUTCDate(nextDate.getUTCDate() + amount);
  return nextDate;
}

// Formats reservation dates as `YYYY-MM-DD`, which is the shared transport format used across the app.
export function formatReservationDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

// Builds the day list for a reservation week so the API can return labeled dates for the dashboard.
export function createReservationWeekDays(weekStart: Date) {
  return DAY_LABELS.map((label, index) => ({
    date: formatReservationDate(addReservationDays(weekStart, index)),
    label,
  }));
}

// Derives the current week boundaries from a selected date so reservation lookups can work with a stable weekly range.
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
