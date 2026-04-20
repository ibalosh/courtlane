import type { UseQueryResult } from '@tanstack/react-query';
import type { WeekScheduleResponse } from '../../../api/reservations';
import type { useDashboardPage } from '../../../hooks/use-dashboard-page';

export type DashboardMetrics = ReturnType<typeof useDashboardPage>['metrics'];

export type DashboardSchedule = WeekScheduleResponse | undefined;

export type DashboardReservationMap = ReturnType<typeof useDashboardPage>['reservationMap'];

export type DashboardSelectedDay = ReturnType<typeof useDashboardPage>['selectedDay'];

export type DashboardSubmitReservation = ReturnType<typeof useDashboardPage>['submitReservation'];

export type DashboardScheduleQuery = UseQueryResult<WeekScheduleResponse, Error>;
