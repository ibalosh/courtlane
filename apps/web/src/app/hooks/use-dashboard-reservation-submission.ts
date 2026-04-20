import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createCustomer } from '../api/customers';
import { clearReservation, createReservation, updateReservation } from '../api/reservations';
import { createSlotDateTime, getWeekScheduleQueryKey } from '../pages/account/dashboard-page.utils';
import type { DashboardSubmitReservationInput } from '../components/account/dashboard/dashboard-types';

type UseDashboardReservationSubmissionOptions = {
  weekStart: string;
};

export function useDashboardReservationSubmission({ weekStart }: UseDashboardReservationSubmissionOptions) {
  const createCustomerMutation = useMutation({ mutationFn: createCustomer });
  const createReservationMutation = useMutation({ mutationFn: createReservation });
  const updateReservationMutation = useMutation({
    mutationFn: ({ customerId, id }: { customerId: number; id: number }) => updateReservation(id, { customerId }),
  });
  const clearReservationMutation = useMutation({ mutationFn: clearReservation });

  const queryClient = useQueryClient();
  async function refreshWeek() {
    await queryClient.invalidateQueries({ queryKey: getWeekScheduleQueryKey(weekStart)});
  }

  async function resolveCustomerId(customerId: number | null, customerName: string) {
    if (customerId) {
      return customerId;
    }

    const response = await createCustomerMutation.mutateAsync({ name: customerName});
    return response.customer.id;
  }

  async function clearExistingReservation(reservationId: number) {
    await clearReservationMutation.mutateAsync(reservationId);
    await refreshWeek();
  }

  async function saveReservation({
    courtId,
    customerId,
    date,
    reservationId,
    startTime,
  }: Pick<DashboardSubmitReservationInput, 'courtId' | 'date' | 'reservationId' | 'startTime'> & {
    customerId: number;
  }) {
    if (reservationId) {
      await updateReservationMutation.mutateAsync({ customerId,id: reservationId});
      return;
    }

    await createReservationMutation.mutateAsync({ courtId, customerId, startsAt: createSlotDateTime(date, startTime)});
  }

  async function submitReservation({ courtId, customer, customerName, date, reservationId, startTime}: DashboardSubmitReservationInput) {
    const normalizedCustomerName = customerName?.trim() ?? '';

    if (!normalizedCustomerName) {
      if (reservationId) {
        await clearExistingReservation(reservationId);
      }

      return;
    }

    const customerId = await resolveCustomerId(customer?.id ?? null, normalizedCustomerName);
    await saveReservation({ courtId, customerId, date, reservationId, startTime });
    await refreshWeek();
  }

  return {
    isSaving:
      createCustomerMutation.isPending ||
      createReservationMutation.isPending ||
      updateReservationMutation.isPending ||
      clearReservationMutation.isPending,
    submitReservation,
  };
}
