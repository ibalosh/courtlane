import { DashboardSchedulePanel } from '../../components/account/dashboard/dashboard-schedule-panel';
import { DashboardWeekPicker } from '../../components/account/dashboard/dashboard-week-picker';
import { useDashboardReservationSubmission } from '../../hooks/use-dashboard-reservation-submission';
import { useDashboardSchedule } from '../../hooks/use-dashboard-schedule';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

type DashboardMetricCardProps = {
  label: string;
  value: string;
};

function formatSelectedDayLabel(dayLabel: string | null | undefined, weekLabel: string | null) {
  if (!dayLabel) {
    return weekLabel ? `Viewing ${weekLabel}` : 'Weekly schedule';
  }

  return weekLabel ? `${dayLabel} in ${weekLabel}` : dayLabel;
}

export function DashboardMetricCard({ label, value }: DashboardMetricCardProps) {
  return (
    <Card className="gap-2 py-4 shadow-none bg-amber-50" size="sm">
      <CardContent className="space-y-1">
        <p className="text-muted-foreground text-xs font-semibold uppercase tracking-[0.16em]">{label}</p>
        <p className="font-heading text-2xl text-foreground">{value}</p>
      </CardContent>
    </Card>
  );
}

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
  const footerSummary = formatSelectedDayLabel(selectedDay?.label, weekLabel);

  return (
    <Card className="overflow-visible rounded-none border-border/70 bg-background/90 py-0 shadow-[0_16px_40px_rgba(15,23,42,0.08)] sm:rounded-2xl">
      <CardHeader className="m-5 gap-3 rounded-none border-b sm:rounded-t-xl">
        <p className="text-muted-foreground text-xs font-semibold uppercase tracking-[0.16em]">Dashboard</p>
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0 flex-1">
            <CardTitle className="text-[clamp(2rem,5vw,3.25rem)] leading-[0.94]">Weekly Court Planner</CardTitle>
            <CardDescription className="mt-2 max-w-2xl leading-6">
              <p>View the live weekly schedule. Click a slot to edit it directly.</p>
            </CardDescription>
          </div>
          <div className="shrink-0">
            <div className="grid gap-3 sm:grid-cols-3">
              <DashboardMetricCard label="Reserved slots" value={String(metrics.reservedSlots)} />
              <DashboardMetricCard label="Free slots" value={String(metrics.freeSlots)} />
              <DashboardMetricCard label="Active courts" value={String(metrics.activeCourts)} />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="grid gap-2">
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
      <CardFooter className="rounded-none border-t bg-stone-50/80 sm:rounded-b-xl">
        <div className="flex w-full flex-col gap-4 py-5 text-sm text-slate-700 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Planner status</p>
            <p className="font-medium text-slate-900">{isSaving ? 'Saving reservation changes...' : footerSummary}</p>
            <p className="text-slate-600">
              {metrics.reservedSlots} reserved across {metrics.activeCourts} courts with {metrics.freeSlots} open slots
              left this week.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-medium text-slate-700">
              Click a slot to edit
            </span>
            <span className="rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-medium text-slate-700">
              Enter saves
            </span>
            <span className="rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-medium text-slate-700">
              Escape cancels
            </span>
            <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-800">
              Clear to remove reservation
            </span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
