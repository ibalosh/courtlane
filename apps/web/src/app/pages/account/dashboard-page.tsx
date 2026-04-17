import { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { WeekScheduleResponse } from '../../api/reservations';
import { getWeekSchedule } from '../../api/reservations';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useAccountUser } from './account-page';

type ReservationStatus = 'free' | 'reserved';

const statusStyles: Record<ReservationStatus, string> = {
  free: 'border-emerald-200 bg-emerald-50/90 text-emerald-900 hover:border-emerald-400 hover:bg-emerald-100',
  reserved: 'border-slate-200 bg-slate-100/85 text-slate-700',
};

export function DashboardPage() {
  const user = useAccountUser();
  const [weekStart, setWeekStart] = useState(getCurrentWeekStartDateString);
  const scheduleQuery = useQuery({
    queryKey: ['reservations', 'week', weekStart],
    queryFn: () => getWeekSchedule({ start: weekStart }),
  });
  const schedule = scheduleQuery.data;
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  useEffect(() => {
    if (!schedule) {
      return;
    }

    const selectedDateStillVisible = schedule.week.days.some(
      (day) => day.date === selectedDate,
    );

    if (!selectedDateStillVisible) {
      setSelectedDate(schedule.week.days[0]?.date ?? null);
    }
  }, [schedule, selectedDate]);

  const selectedDay =
    schedule?.week.days.find((day) => day.date === selectedDate) ?? null;
  const reservationMap = useMemo(() => {
    return createReservationMap(schedule);
  }, [schedule]);

  const reservedSlotCount = schedule?.reservations.length ?? 0;
  const freeSlotCount = schedule
    ? schedule.courts.length *
        schedule.week.days.length *
        schedule.slots.length -
      reservedSlotCount
    : 0;

  return (
    <section className="grid gap-6">
      <Card className="border border-slate-900/10 bg-[#fffaf1]/92 py-0 shadow-[0_1rem_3rem_rgba(71,46,21,0.12)]">
        <CardHeader className="gap-3 border-b border-slate-900/10 px-6 py-6">
          <p className="text-[0.8rem] font-bold uppercase tracking-[0.18em] text-amber-800">
            Dashboard
          </p>
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <CardTitle className="text-[clamp(2rem,5vw,3.25rem)] leading-[0.94] text-slate-900">
                Weekly Court Planner
              </CardTitle>
              <CardDescription className="mt-2 max-w-2xl text-sm leading-6 text-slate-900/68">
                View the live weekly schedule for your account. Slots run in
                45-minute intervals from 9:00 AM through midnight.
              </CardDescription>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <Metric
                label="Reserved slots"
                value={String(reservedSlotCount)}
              />
              <Metric label="Free slots" value={String(freeSlotCount)} />
              <Metric
                label="Visible courts"
                value={String(schedule?.courts.length ?? 0)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid gap-6 px-0 py-0">
          <div className="flex flex-col gap-4 px-6 pt-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  Signed in as {user.name}
                </p>
                <p className="mt-1 text-sm text-slate-900/65">
                  {schedule
                    ? `${formatWeekLabel(schedule.week.start, schedule.week.end)}`
                    : 'Loading weekly schedule...'}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  className="rounded-full"
                  onClick={() =>
                    setWeekStart((current) => shiftDateString(current, -7))
                  }
                  type="button"
                  variant="outline"
                >
                  Previous week
                </Button>
                <Button
                  className="rounded-full"
                  onClick={() =>
                    setWeekStart((current) => shiftDateString(current, 7))
                  }
                  type="button"
                  variant="outline"
                >
                  Next week
                </Button>
              </div>
            </div>
            {schedule ? (
              <div className="flex gap-2 overflow-x-auto">
                {schedule.week.days.map((day) => (
                  <Button
                    className="rounded-full whitespace-nowrap"
                    key={day.date}
                    onClick={() => setSelectedDate(day.date)}
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
          {scheduleQuery.isLoading ? (
            <div className="px-6 pb-6">
              <p className="text-sm text-slate-900/65">Loading schedule...</p>
            </div>
          ) : scheduleQuery.isError ? (
            <div className="px-6 pb-6">
              <p className="text-sm text-red-700">
                {scheduleQuery.error instanceof Error
                  ? scheduleQuery.error.message
                  : 'Failed to load weekly schedule.'}
              </p>
            </div>
          ) : schedule && selectedDay ? (
            <>
              <div className="overflow-hidden rounded-b-2xl">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-slate-900/10 bg-[#f6efe0]/80 hover:bg-[#f6efe0]/80">
                      <TableHead className="min-w-40 border-r border-slate-900/10 bg-[#f6efe0] px-6 text-slate-900">
                        Time
                      </TableHead>
                      {schedule.courts.map((court) => (
                        <TableHead
                          className="min-w-52 border-r border-slate-900/10 px-4 text-center text-slate-900 last:border-r-0"
                          key={court.id}
                        >
                          {court.name}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {schedule.slots.map((slot) => (
                      <TableRow
                        className="border-b border-slate-900/10 bg-[#fffaf1]/92 hover:bg-[#fff6ea]"
                        key={slot.key}
                      >
                        <TableCell className="border-r border-slate-900/10 bg-[#fcf5e8] px-5 py-3.5">
                          <div className="font-semibold text-slate-900">
                            {slot.label}
                          </div>
                          <div className="mt-1 text-xs uppercase tracking-[0.08em] text-slate-900/55">
                            {formatSlotRange(
                              slot.startMinutes,
                              slot.endMinutes,
                            )}
                          </div>
                        </TableCell>
                        {schedule.courts.map((court) => {
                          const reservation = reservationMap.get(
                            `${selectedDay.date}:${slot.key}:${court.id}`,
                          );
                          const cell = reservation
                            ? {
                                id: String(reservation.id),
                                status: 'reserved' as const,
                                customerName: reservation.customer.name,
                                customerEmail: reservation.customer.email,
                              }
                            : {
                                id: `${selectedDay.date}:${slot.key}:${court.id}`,
                                status: 'free' as const,
                              };

                          return (
                            <TableCell
                              className="border-r border-slate-900/10 px-3 py-3 last:border-r-0"
                              key={`${selectedDay.date}-${slot.key}-${court.id}`}
                            >
                              <button
                                className={`flex w-full items-center justify-between rounded-2xl border px-3 py-2 text-left transition-colors ${statusStyles[cell.status]}`}
                                disabled
                                type="button"
                              >
                                <span>
                                  <span className="block text-xs font-bold uppercase tracking-[0.12em] opacity-70">
                                    {selectedDay.label}
                                  </span>
                                  <span className="mt-1 block text-sm font-medium">
                                    {cell.status === 'free'
                                      ? 'Available'
                                      : 'Reserved'}
                                  </span>
                                </span>
                                <span className="text-right text-xs font-medium">
                                  {cell.status === 'free' ? (
                                    'Open'
                                  ) : (
                                    <span className="block max-w-28 truncate">
                                      {cell.customerName}
                                    </span>
                                  )}
                                </span>
                              </button>
                              {cell.status === 'reserved' &&
                              cell.customerEmail ? (
                                <p className="mt-2 truncate text-xs text-slate-900/55">
                                  {cell.customerEmail}
                                </p>
                              ) : null}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="grid gap-3 px-6 pb-6 sm:grid-cols-2">
                <LegendChip
                  description="Open slot with no reservation for the selected court and time."
                  label="Free"
                  tone="free"
                />
                <LegendChip
                  description="Reserved slot with a customer already assigned."
                  label="Reserved"
                  tone="reserved"
                />
              </div>
            </>
          ) : null}
        </CardContent>
      </Card>
      <Card className="border border-slate-900/10 bg-[#fffaf1]/88 py-0 shadow-[0_1rem_3rem_rgba(71,46,21,0.1)]">
        <CardContent className="flex flex-col gap-4 px-6 py-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-900">
              Live schedule for {user.name}
            </p>
            <p className="mt-1 text-sm text-slate-900/65">
              This screen now reads reservation data from the API. Editing,
              customer search, and clearing slots are the next step.
            </p>
          </div>
          <Button
            className="rounded-full"
            onClick={() => scheduleQuery.refetch()}
            type="button"
            variant="outline"
          >
            Refresh week
          </Button>
        </CardContent>
      </Card>
    </section>
  );
}

function createReservationMap(schedule?: WeekScheduleResponse) {
  const entries = schedule?.reservations.map((reservation) => [
    `${getReservationDayKey(reservation.startsAt)}:${getReservationSlotKey(reservation.startsAt)}:${reservation.courtId}`,
    reservation,
  ]);

  return new Map(entries);
}

function getCurrentWeekStartDateString() {
  const today = new Date();
  const utcDate = new Date(
    Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()),
  );
  const utcDay = utcDate.getUTCDay();
  const diff = utcDay === 0 ? -6 : 1 - utcDay;

  utcDate.setUTCDate(utcDate.getUTCDate() + diff);

  return utcDate.toISOString().slice(0, 10);
}

function shiftDateString(dateString: string, amount: number) {
  const date = new Date(`${dateString}T00:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + amount);
  return date.toISOString().slice(0, 10);
}

function getReservationDayKey(startsAt: string) {
  return startsAt.slice(0, 10);
}

function getReservationSlotKey(startsAt: string) {
  const date = new Date(startsAt);
  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');

  return `${hours}:${minutes}`;
}

function formatWeekLabel(weekStart: string, weekEnd: string) {
  const formatter = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  });

  return `${formatter.format(new Date(`${weekStart}T00:00:00.000Z`))} - ${formatter.format(new Date(`${weekEnd}T00:00:00.000Z`))}`;
}

function formatSlotRange(startMinutes: number, endMinutes: number) {
  return `${formatTimeLabel(startMinutes)} - ${formatTimeLabel(endMinutes)}`;
}

function formatTimeLabel(totalMinutes: number) {
  if (totalMinutes === 24 * 60) {
    return '12:00 AM';
  }

  const hours = Math.floor(totalMinutes / 60) % 24;
  const minutes = totalMinutes % 60;
  const suffix = hours >= 12 ? 'PM' : 'AM';
  const hour12 = hours % 12 || 12;

  return `${hour12}:${String(minutes).padStart(2, '0')} ${suffix}`;
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-slate-900/10 bg-white/60 px-4 py-3">
      <p className="text-[0.72rem] font-bold uppercase tracking-[0.16em] text-slate-900/50">
        {label}
      </p>
      <p className="mt-2 font-heading text-2xl text-slate-900">{value}</p>
    </div>
  );
}

function LegendChip({
  description,
  label,
  tone,
}: {
  description: string;
  label: string;
  tone: ReservationStatus;
}) {
  return (
    <div className="rounded-3xl border border-slate-900/10 bg-white/60 p-4">
      <div
        className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] ${statusStyles[tone]}`}
      >
        {label}
      </div>
      <p className="mt-3 text-sm text-slate-900/65">{description}</p>
    </div>
  );
}
