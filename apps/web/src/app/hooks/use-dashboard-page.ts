import { useEffect, useMemo, useState } from 'react';
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { createCustomer } from '../api/customers';
import {
  clearReservation,
  createReservation,
  getWeekSchedule,
  updateReservation,
} from '../api/reservations';
import {
  createReservationMap,
  createSlotDateTime,
  formatWeekLabel,
  getCurrentWeekStartDateString,
  getWeekScheduleQueryKey,
  shiftDateString,
} from '../pages/account/dashboard-page.utils';

type CustomerOption = {
  id: number;
  email: string | null;
  name: string;
};

type SubmitReservationInput = {
  courtId: number;
  customer: CustomerOption | null;
  customerName: string | null;
  date: string;
  reservationId: number | null;
  startTime: string;
};

export function useDashboardPage() {
  const queryClient = useQueryClient();
  const [weekStart, setWeekStart] = useState(getCurrentWeekStartDateString);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const scheduleQuery = useQuery({
    queryKey: getWeekScheduleQueryKey(weekStart),
    queryFn: () => getWeekSchedule({ start: weekStart }),
    placeholderData: keepPreviousData,
  });

  const createCustomerMutation = useMutation({
    mutationFn: createCustomer,
  });
  const createReservationMutation = useMutation({
    mutationFn: createReservation,
  });
  const updateReservationMutation = useMutation({
    mutationFn: ({ customerId, id }: { customerId: number; id: number }) =>
      updateReservation(id, { customerId }),
  });
  const clearReservationMutation = useMutation({
    mutationFn: clearReservation,
  });

  const schedule = scheduleQuery.data;
  const reservationMap = useMemo(
    () => createReservationMap(schedule),
    [schedule],
  );
  const selectedDay =
    schedule?.week.days.find((day) => day.date === selectedDate) ?? null;

  useEffect(() => {
    if (!schedule) {
      return;
    }

    const selectedDateStillVisible = schedule.week.days.some(
      (day) => day.date === selectedDate,
    );

    if (!selectedDateStillVisible) {
      setSelectedDate(schedule.week.days[0]?.date ?? null);
    }
  }, [schedule, selectedDate]);

  const metrics = useMemo(() => {
    const reservedSlots = schedule?.reservations.length ?? 0;
    const availableSlots = schedule
      ? schedule.courts.length *
        schedule.week.days.length *
        schedule.slots.length
      : 0;

    return {
      activeCourts: schedule?.courts.length ?? 0,
      freeSlots: availableSlots - reservedSlots,
      reservedSlots,
    };
  }, [schedule]);

  const isSaving =
    createCustomerMutation.isPending ||
    createReservationMutation.isPending ||
    updateReservationMutation.isPending ||
    clearReservationMutation.isPending;
  const isWeekTransitioning =
    scheduleQuery.isFetching && !scheduleQuery.isLoading;

  async function refreshWeek() {
    await queryClient.invalidateQueries({
      queryKey: getWeekScheduleQueryKey(weekStart),
    });
  }

  async function submitReservation({
    courtId,
    customer,
    customerName,
    date,
    reservationId,
    startTime,
  }: SubmitReservationInput) {
    const normalizedCustomerName = customerName?.trim() ?? '';

    if (!normalizedCustomerName) {
      if (reservationId) {
        await clearReservationMutation.mutateAsync(reservationId);
        await refreshWeek();
      }

      return;
    }

    const customerId =
      customer?.id ??
      (
        await createCustomerMutation.mutateAsync({
          name: normalizedCustomerName,
        })
      ).customer.id;

    if (reservationId) {
      await updateReservationMutation.mutateAsync({
        customerId,
        id: reservationId,
      });
    } else {
      await createReservationMutation.mutateAsync({
        courtId,
        customerId,
        startsAt: createSlotDateTime(date, startTime),
      });
    }

    await refreshWeek();
  }

  return {
    goToNextWeek: () =>
      setWeekStart((currentWeekStart) => shiftDateString(currentWeekStart, 7)),
    goToPreviousWeek: () =>
      setWeekStart((currentWeekStart) => shiftDateString(currentWeekStart, -7)),
    isSaving,
    isWeekTransitioning,
    metrics,
    reservationMap,
    schedule,
    scheduleQuery,
    selectDate: setSelectedDate,
    selectedDate,
    selectedDay,
    submitReservation,
    weekLabel: schedule
      ? formatWeekLabel(schedule.week.start, schedule.week.end)
      : null,
  };
}
