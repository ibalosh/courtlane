import { useEffect, useState } from 'react';
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createCustomer } from '../../api/customers';
import { clearReservation, createReservation, getWeekSchedule, updateReservation } from '../../api/reservations';
import { DashboardHeader } from '../../components/account/dashboard/dashboard-header';
import { DashboardSchedulePanel } from '../../components/account/dashboard/dashboard-schedule-panel';
import type { DashboardSubmitReservationInput } from '../../components/account/dashboard/dashboard-types';
import { DashboardWeekPicker } from '../../components/account/dashboard/dashboard-week-picker';
import { Card, CardContent } from '@/components/ui/card';
import {
  createReservationMap,
  createSlotDateTime,
  formatWeekLabel,
  getCurrentWeekStartDateString,
  getWeekScheduleQueryKey,
  shiftDateString,
} from '@/app/pages/account/dashboard-page.utils';

export function DashboardPage() {
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
    mutationFn: ({ customerId, id }: { customerId: number; id: number }) => updateReservation(id, { customerId }),
  });
  const clearReservationMutation = useMutation({
    mutationFn: clearReservation,
  });

  const schedule = scheduleQuery.data;
  const reservationMap = createReservationMap(schedule);
  const selectedDay = schedule?.week.days.find((day) => day.date === selectedDate) ?? null;
  const reservedSlots = schedule?.reservations.length ?? 0;
  const availableSlots = schedule ? schedule.courts.length * schedule.week.days.length * schedule.slots.length : 0;
  const metrics = {
    activeCourts: schedule?.courts.length ?? 0,
    freeSlots: availableSlots - reservedSlots,
    reservedSlots,
  };
  const isSaving =
    createCustomerMutation.isPending ||
    createReservationMutation.isPending ||
    updateReservationMutation.isPending ||
    clearReservationMutation.isPending;
  const isWeekTransitioning = scheduleQuery.isFetching && !scheduleQuery.isLoading;
  const weekLabel = schedule ? formatWeekLabel(schedule.week.start, schedule.week.end) : null;

  useEffect(() => {
    if (!schedule) {
      return;
    }

    const selectedDateStillVisible = schedule.week.days.some((day) => day.date === selectedDate);

    if (!selectedDateStillVisible) {
      setSelectedDate(schedule.week.days[0]?.date ?? null);
    }
  }, [schedule, selectedDate]);

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
  }: DashboardSubmitReservationInput) {
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

  return (
    <Card className="border-border/70 bg-background/90 py-0 shadow-[0_16px_40px_rgba(15,23,42,0.08)]">
      <DashboardHeader metrics={metrics} />
      <CardContent className="grid gap-6 py-6">
        <DashboardWeekPicker
          isWeekTransitioning={isWeekTransitioning}
          onNextWeek={() => setWeekStart((currentWeekStart) => shiftDateString(currentWeekStart, 7))}
          onPreviousWeek={() => setWeekStart((currentWeekStart) => shiftDateString(currentWeekStart, -7))}
          onSelectDate={setSelectedDate}
          schedule={schedule}
          selectedDate={selectedDate}
          weekLabel={weekLabel}
        />
        <DashboardSchedulePanel
          isSaving={isSaving}
          isWeekTransitioning={isWeekTransitioning}
          reservationMap={reservationMap}
          schedule={schedule}
          scheduleQuery={scheduleQuery}
          selectedDay={selectedDay}
          submitReservation={submitReservation}
        />
      </CardContent>
    </Card>
  );
}
