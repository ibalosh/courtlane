import { useEffect, useState } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { getWeekSchedule } from '../api/reservations';
import {
  createReservationMap,
  formatWeekLabel,
  getCurrentWeekStartDateString,
  getWeekScheduleQueryKey,
  shiftDateString,
} from '../pages/account/dashboard-page.utils';

export function useDashboardSchedule() {
  const [weekStart, setWeekStart] = useState(getCurrentWeekStartDateString);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);

  const scheduleQuery = useQuery({
    queryKey: getWeekScheduleQueryKey(weekStart),
    queryFn: () => getWeekSchedule({ start: weekStart }),
    placeholderData: keepPreviousData,
  });

  const schedule = scheduleQuery.data;
  const reservationMap = createReservationMap(schedule);
  const selectedDay = schedule?.week.days[selectedDayIndex] ?? null;
  const reservedSlots = schedule?.reservations.length ?? 0;
  const availableSlots = schedule ? schedule.courts.length * schedule.week.days.length * schedule.slots.length : 0;
  const metrics = {
    activeCourts: schedule?.courts.length ?? 0,
    freeSlots: availableSlots - reservedSlots,
    reservedSlots,
  };
  const isWeekTransitioning = scheduleQuery.isFetching && !scheduleQuery.isLoading;
  const weekLabel = schedule ? formatWeekLabel(schedule.week.start, schedule.week.end) : null;

  useEffect(() => {
    if (!schedule) {
      return;
    }

    if (!schedule.week.days[selectedDayIndex]) {
      setSelectedDayIndex(0);
    }
  }, [schedule, selectedDayIndex]);

  function goToNextWeek() {
    setWeekStart((currentWeekStart) => shiftDateString(currentWeekStart, 7));
  }

  function goToPreviousWeek() {
    setWeekStart((currentWeekStart) => shiftDateString(currentWeekStart, -7));
  }

  function selectDate(date: string) {
    const nextSelectedDayIndex = schedule?.week.days.findIndex((day) => day.date === date) ?? -1;

    if (nextSelectedDayIndex >= 0) {
      setSelectedDayIndex(nextSelectedDayIndex);
    }
  }

  return {
    isWeekTransitioning,
    metrics,
    reservationMap,
    schedule,
    scheduleQuery,
    selectedDay,
    selectDate,
    weekLabel,
    weekStart,
    goToNextWeek,
    goToPreviousWeek,
  };
}
