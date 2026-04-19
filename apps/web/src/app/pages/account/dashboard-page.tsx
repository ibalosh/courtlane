import { DashboardHeader } from '../../components/account/dashboard/dashboard-header';
import { DashboardScheduleState } from '../../components/account/dashboard/dashboard-schedule-state';
import { DashboardWeekPicker } from '../../components/account/dashboard/dashboard-week-picker';
import { useDashboardPage } from '../../hooks/use-dashboard-page';
import { Card, CardContent } from '@/components/ui/card';

export function DashboardPage() {
  const {
    goToNextWeek,
    goToPreviousWeek,
    isSaving,
    isWeekTransitioning,
    metrics,
    reservationMap,
    schedule,
    scheduleQuery,
    selectDate,
    selectedDate,
    selectedDay,
    submitReservation,
    weekLabel,
  } = useDashboardPage();

  return (
    <DashboardScheduleCard
      isSaving={isSaving}
      isWeekTransitioning={isWeekTransitioning}
      metrics={metrics}
      onNextWeek={goToNextWeek}
      onPreviousWeek={goToPreviousWeek}
      onSelectDate={selectDate}
      reservationMap={reservationMap}
      schedule={schedule}
      scheduleQuery={scheduleQuery}
      selectedDate={selectedDate}
      selectedDay={selectedDay}
      submitReservation={submitReservation}
      weekLabel={weekLabel}
    />
  );
}

type DashboardScheduleCardProps = Pick<
  ReturnType<typeof useDashboardPage>,
  | 'isSaving'
  | 'isWeekTransitioning'
  | 'metrics'
  | 'reservationMap'
  | 'schedule'
  | 'scheduleQuery'
  | 'selectedDate'
  | 'selectedDay'
  | 'submitReservation'
  | 'weekLabel'
> & {
  onNextWeek: () => void;
  onPreviousWeek: () => void;
  onSelectDate: (date: string) => void;
};

function DashboardScheduleCard({
  isSaving,
  isWeekTransitioning,
  metrics,
  onNextWeek,
  onPreviousWeek,
  onSelectDate,
  reservationMap,
  schedule,
  scheduleQuery,
  selectedDate,
  selectedDay,
  submitReservation,
  weekLabel,
}: DashboardScheduleCardProps) {
  return (
    <Card className="border-border/70 bg-background/90 py-0 shadow-[0_16px_40px_rgba(15,23,42,0.08)]">
      <DashboardHeader metrics={metrics} />
      <CardContent className="grid gap-6 py-6">
        <DashboardWeekPicker
          isWeekTransitioning={isWeekTransitioning}
          onNextWeek={onNextWeek}
          onPreviousWeek={onPreviousWeek}
          onSelectDate={onSelectDate}
          schedule={schedule}
          selectedDate={selectedDate}
          weekLabel={weekLabel}
        />
        <DashboardScheduleState
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
