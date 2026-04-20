import { DashboardHeader } from '../../components/account/dashboard/dashboard-header';
import { DashboardSchedulePanel } from '../../components/account/dashboard/dashboard-schedule-panel';
import { DashboardWeekPicker } from '../../components/account/dashboard/dashboard-week-picker';
import { useDashboardReservationSubmission } from '../../hooks/use-dashboard-reservation-submission';
import { useDashboardSchedule } from '../../hooks/use-dashboard-schedule';
import { Card, CardContent } from '@/components/ui/card';

export function DashboardPage() {
  const {
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
  } = useDashboardSchedule();
  const { isSaving, submitReservation } = useDashboardReservationSubmission({ weekStart });

  return (
    <Card className="border-border/70 bg-background/90 py-0 shadow-[0_16px_40px_rgba(15,23,42,0.08)]">
      <DashboardHeader metrics={metrics} />
      <CardContent className="grid gap-6 py-6">
        <DashboardWeekPicker
          isWeekTransitioning={isWeekTransitioning}
          onNextWeek={goToNextWeek}
          onPreviousWeek={goToPreviousWeek}
          onSelectDate={selectDate}
          schedule={schedule}
          selectedDate={selectedDay?.date ?? null}
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
