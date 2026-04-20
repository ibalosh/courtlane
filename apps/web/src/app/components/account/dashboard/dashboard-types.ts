import type { UseQueryResult } from '@tanstack/react-query';
import type { WeekScheduleResponse } from '../../../api/reservations';

export type DashboardMetrics = {
  activeCourts: number;
  freeSlots: number;
  reservedSlots: number;
};

export type DashboardSchedule = WeekScheduleResponse | undefined;
export type DashboardReservation = WeekScheduleResponse['reservations'][number];
export type DashboardReservationMap = Map<string, DashboardReservation>;
export type DashboardSelectedDay = WeekScheduleResponse['week']['days'][number] | null;

export type DashboardCustomerOption = {
  id: number;
  email: string | null;
  name: string;
};

export type DashboardSubmitReservationInput = {
  courtId: number;
  customer: DashboardCustomerOption | null;
  customerName: string | null;
  date: string;
  reservationId: number | null;
  startTime: string;
};

export type DashboardSubmitReservation = (input: DashboardSubmitReservationInput) => Promise<void>;
export type DashboardScheduleQuery = UseQueryResult<WeekScheduleResponse, Error>;
