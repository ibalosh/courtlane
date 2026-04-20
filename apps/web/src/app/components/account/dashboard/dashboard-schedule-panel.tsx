import { DashboardScheduleTable } from './dashboard-schedule-table';
import type {
  DashboardReservationMap,
  DashboardSchedule,
  DashboardScheduleQuery,
  DashboardSelectedDay,
  DashboardSubmitReservation,
} from './dashboard-types';
import { cn } from '@/lib/utils';

type DashboardSchedulePanelProps = {
  isSaving: boolean;
  isWeekTransitioning: boolean;
  reservationMap: DashboardReservationMap;
  schedule: DashboardSchedule;
  scheduleQuery: DashboardScheduleQuery;
  selectedDay: DashboardSelectedDay;
  submitReservation: DashboardSubmitReservation;
};

export function DashboardSchedulePanel({
  isSaving,
  isWeekTransitioning,
  reservationMap,
  schedule,
  scheduleQuery,
  selectedDay,
  submitReservation,
}: DashboardSchedulePanelProps) {
  if (scheduleQuery.isLoading) {
    return <p className="text-muted-foreground text-sm">Loading schedule...</p>;
  }

  if (scheduleQuery.isError) {
    return <p className="text-sm text-destructive">{scheduleQuery.error.message}</p>;
  }

  return (
    <div className={cn('grid gap-3 transition-all duration-200', isWeekTransitioning && 'translate-y-1 opacity-70')}>
      <p className="text-muted-foreground text-sm">
        Click a slot to edit it in place. Press Enter to save, Escape to cancel, and clear the field to remove an
        existing reservation.
      </p>
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
