import { DashboardScheduleTable } from './dashboard-schedule-table';
import type {
  DashboardReservationMap,
  DashboardSchedule,
  DashboardScheduleQuery,
  DashboardSelectedDay,
  DashboardSubmitReservation,
} from './dashboard-types';
import { cn } from '@/lib/utils';

type DashboardScheduleStateProps = {
  isSaving: boolean;
  isWeekTransitioning: boolean;
  reservationMap: DashboardReservationMap;
  schedule: DashboardSchedule;
  scheduleQuery: DashboardScheduleQuery;
  selectedDay: DashboardSelectedDay;
  submitReservation: DashboardSubmitReservation;
};

export function DashboardScheduleState({
  isSaving,
  isWeekTransitioning,
  reservationMap,
  schedule,
  scheduleQuery,
  selectedDay,
  submitReservation,
}: DashboardScheduleStateProps) {
  if (scheduleQuery.isLoading) {
    return <p className="text-muted-foreground text-sm">Loading schedule...</p>;
  }

  if (scheduleQuery.isError) {
    return (
      <p className="text-sm text-destructive">
        {scheduleQuery.error instanceof Error
          ? scheduleQuery.error.message
          : 'Failed to load weekly schedule.'}
      </p>
    );
  }

  return (
    <div
      className={cn(
        'transition-all duration-200',
        isWeekTransitioning && 'translate-y-1 opacity-70',
      )}
    >
      <DashboardScheduleTable
        isSaving={isSaving}
        reservationMap={reservationMap}
        schedule={schedule}
        selectedDay={selectedDay}
        submitReservation={submitReservation}
      />
    </div>
  );
}
