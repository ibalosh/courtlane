import type { DashboardSchedule } from './dashboard-types';
import { Button } from '@/components/ui/button';

type DashboardWeekPickerProps = {
  isWeekTransitioning: boolean;
  onNextWeek: () => void;
  onPreviousWeek: () => void;
  onSelectDate: (date: string) => void;
  schedule: DashboardSchedule;
  selectedDate: string | null;
  weekLabel: string | null;
};

export function DashboardWeekPicker({
  isWeekTransitioning,
  onNextWeek,
  onPreviousWeek,
  onSelectDate,
  schedule,
  selectedDate,
  weekLabel,
}: DashboardWeekPickerProps) {
  return (
    <div className="grid gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-muted-foreground text-sm">
          {weekLabel ?? 'Loading weekly schedule...'}
        </p>
        <div className="flex gap-2">
          <Button
            disabled={isWeekTransitioning}
            onClick={onPreviousWeek}
            type="button"
            variant="outline"
          >
            Previous week
          </Button>
          <Button
            disabled={isWeekTransitioning}
            onClick={onNextWeek}
            type="button"
            variant="outline"
          >
            Next week
          </Button>
        </div>
      </div>
      {schedule ? (
        <div
          className={`flex gap-2 overflow-x-auto pb-1 transition-opacity duration-200 ${
            isWeekTransitioning ? 'opacity-70' : 'opacity-100'
          }`}
        >
          {schedule.week.days.map((day) => (
            <Button
              className="whitespace-nowrap"
              key={day.date}
              onClick={() => onSelectDate(day.date)}
              size="sm"
              type="button"
              variant={selectedDate === day.date ? 'default' : 'outline'}
            >
              {day.label}
            </Button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
