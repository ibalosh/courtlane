import {
  DAY_END_MINUTES,
  DAY_START_MINUTES,
  SLOT_DURATION_MINUTES,
} from './reservation-schedule.config';

function createReservationSlotStartTime(totalMinutes: number) {
  const hours = Math.floor(totalMinutes / 60) % 24;
  const minutes = totalMinutes % 60;

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

function formatReservationSlotLabel(totalMinutes: number) {
  if (totalMinutes === 24 * 60) {
    return '12:00 AM';
  }

  const hours = Math.floor(totalMinutes / 60) % 24;
  const minutes = totalMinutes % 60;
  const suffix = hours >= 12 ? 'PM' : 'AM';
  const hour12 = hours % 12 || 12;

  return `${hour12}:${String(minutes).padStart(2, '0')} ${suffix}`;
}

function getReservationSlotStartMinutes(date: Date) {
  return date.getUTCHours() * 60 + date.getUTCMinutes();
}

export function createReservationSlots() {
  const slots: Array<{
    startTime: string;
    label: string;
    startMinutes: number;
    endMinutes: number;
  }> = [];

  for (
    let startMinutes = DAY_START_MINUTES;
    startMinutes < DAY_END_MINUTES;
    startMinutes += SLOT_DURATION_MINUTES
  ) {
    const endMinutes = Math.min(
      startMinutes + SLOT_DURATION_MINUTES,
      DAY_END_MINUTES,
    );

    slots.push({
      startTime: createReservationSlotStartTime(startMinutes),
      label: formatReservationSlotLabel(startMinutes),
      startMinutes,
      endMinutes,
    });
  }

  return slots;
}

export function isValidReservationSlotStart(date: Date) {
  const startMinutes = getReservationSlotStartMinutes(date);

  if (startMinutes < DAY_START_MINUTES || startMinutes >= DAY_END_MINUTES) {
    return false;
  }

  return (startMinutes - DAY_START_MINUTES) % SLOT_DURATION_MINUTES === 0;
}

export function getReservationSlotEndDate(startsAt: Date) {
  return new Date(startsAt.getTime() + SLOT_DURATION_MINUTES * 60 * 1000);
}

export function findReservationSlotByStartTime(startTime: string) {
  return createReservationSlots().find((slot) => slot.startTime === startTime);
}
