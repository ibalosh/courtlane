export const DAY_LABELS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const;
export const SLOT_DURATION_MINUTES = 45;
export const DAY_START_MINUTES = 9 * 60;
export const DAY_END_MINUTES = 24 * 60;

// Encapsulates the fixed reservation schedule rules used by the API:
// it defines the weekly Monday-Sunday calendar, the daily slot grid, and the validation logic
// that decides whether a requested reservation start time lands on a bookable slot.
export class ReservationSchedule {
  // Parses a transport date like `2026-04-22` into a UTC midnight Date so all scheduling math stays timezone-safe.
  private parseDate(dateString: string) {
    const date = new Date(`${dateString}T00:00:00.000Z`);

    if (Number.isNaN(date.getTime())) {
      throw new Error(`Invalid date string: ${dateString}`);
    }

    return date;
  }

  // Normalizes any given date to the Monday that starts its reservation week.
  private startOfWeek(date: Date) {
    const normalizedDate = new Date(date);
    const utcDay = normalizedDate.getUTCDay();
    const diff = utcDay === 0 ? -6 : 1 - utcDay;

    normalizedDate.setUTCDate(normalizedDate.getUTCDate() + diff);
    normalizedDate.setUTCHours(0, 0, 0, 0);

    return normalizedDate;
  }

  // Moves a date by whole UTC days without changing the scheduling rules around it.
  private addDays(date: Date, amount: number) {
    const nextDate = new Date(date);
    nextDate.setUTCDate(nextDate.getUTCDate() + amount);
    return nextDate;
  }

  // Converts a minute offset like `540` into the slot key format used by the API, for example `09:00`.
  private toStartTime(totalMinutes: number) {
    const hours = Math.floor(totalMinutes / 60) % 24;
    const minutes = totalMinutes % 60;

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  }

  // Converts a minute offset into a staff-friendly label like `9:00 AM` for the dashboard.
  private toSlotLabel(totalMinutes: number) {
    if (totalMinutes === 24 * 60) {
      return '12:00 AM';
    }

    const hours = Math.floor(totalMinutes / 60) % 24;
    const minutes = totalMinutes % 60;
    const suffix = hours >= 12 ? 'PM' : 'AM';
    const hour12 = hours % 12 || 12;

    return `${hour12}:${String(minutes).padStart(2, '0')} ${suffix}`;
  }

  // Reads only the time portion of a reservation start so it can be checked against the daily slot grid.
  private getStartMinutes(date: Date) {
    return date.getUTCHours() * 60 + date.getUTCMinutes();
  }

  formatDate(date: Date) {
    return date.toISOString().slice(0, 10);
  }

  getWeekRangeForDate(dateString: string) {
    const weekStart = this.startOfWeek(this.parseDate(dateString));
    const weekEnd = this.addDays(weekStart, 6);
    const nextWeekStart = this.addDays(weekStart, 7);

    return {
      weekStart,
      weekEnd,
      nextWeekStart,
    };
  }

  getWeekDays(weekStart: Date) {
    return DAY_LABELS.map((label, index) => ({
      date: this.formatDate(this.addDays(weekStart, index)),
      label,
    }));
  }

  listDailySlots() {
    const slots: Array<{
      startTime: string;
      label: string;
      startMinutes: number;
      endMinutes: number;
    }> = [];

    for (let startMinutes = DAY_START_MINUTES; startMinutes < DAY_END_MINUTES; startMinutes += SLOT_DURATION_MINUTES) {
      const endMinutes = Math.min(startMinutes + SLOT_DURATION_MINUTES, DAY_END_MINUTES);

      slots.push({
        startTime: this.toStartTime(startMinutes),
        label: this.toSlotLabel(startMinutes),
        startMinutes,
        endMinutes,
      });
    }

    return slots;
  }

  isBookableSlotStart(date: Date) {
    const startMinutes = this.getStartMinutes(date);

    if (startMinutes < DAY_START_MINUTES || startMinutes >= DAY_END_MINUTES) {
      return false;
    }

    // Only allow times whose offset from the first slot start divides evenly into 45-minute increments:
    // if the day starts at 9:00, then 9:45 and 10:30 are valid, but 10:15 is not.
    return (startMinutes - DAY_START_MINUTES) % SLOT_DURATION_MINUTES === 0;
  }

  getSlotEndTime(startsAt: Date) {
    return new Date(startsAt.getTime() + SLOT_DURATION_MINUTES * 60 * 1000);
  }
}

export const reservationSchedule = new ReservationSchedule();
