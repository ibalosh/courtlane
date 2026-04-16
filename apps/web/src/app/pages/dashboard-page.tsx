import { useState } from 'react';
import { Button } from '../components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { useAccountUser } from './account-page';

const dayLabels = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
] as const;

const SLOT_DURATION_MINUTES = 45;
const START_MINUTES = 9 * 60;
const END_MINUTES = 24 * 60;

const timeSlots = createTimeSlots();

const courts = [1, 2, 3] as const;

type DayLabel = (typeof dayLabels)[number];
type TimeSlot = (typeof timeSlots)[number];
type CourtNumber = (typeof courts)[number];
type ReservationStatus = 'free' | 'reserved' | 'mine';

type ReservationCell = {
  id: string;
  day: DayLabel;
  slotKey: TimeSlot['key'];
  court: CourtNumber;
  status: ReservationStatus;
  reservedBy?: string;
};

function createTimeSlots() {
  const slots: Array<{
    key: string;
    label: string;
    range: string;
  }> = [];

  for (
    let startMinutes = START_MINUTES;
    startMinutes < END_MINUTES;
    startMinutes += SLOT_DURATION_MINUTES
  ) {
    const endMinutes = Math.min(
      startMinutes + SLOT_DURATION_MINUTES,
      END_MINUTES,
    );

    slots.push({
      key: formatTimeKey(startMinutes),
      label: formatTimeLabel(startMinutes),
      range: `${formatTimeLabel(startMinutes)} - ${formatTimeLabel(endMinutes)}`,
    });
  }

  return slots;
}

function formatTimeKey(totalMinutes: number) {
  const normalizedHours = Math.floor(totalMinutes / 60) % 24;
  const minutes = totalMinutes % 60;

  return `${String(normalizedHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

function formatTimeLabel(totalMinutes: number) {
  if (totalMinutes === 24 * 60) {
    return '12:00 AM';
  }

  const normalizedHours = Math.floor(totalMinutes / 60) % 24;
  const minutes = totalMinutes % 60;
  const suffix = normalizedHours >= 12 ? 'PM' : 'AM';
  const hour12 = normalizedHours % 12 || 12;

  return `${hour12}:${String(minutes).padStart(2, '0')} ${suffix}`;
}

const initialReservations: ReservationCell[] = dayLabels.flatMap(
  (day, dayIndex) =>
    timeSlots.flatMap((slot, slotIndex) =>
      courts.map((court) => {
        const seed = dayIndex * 17 + slotIndex * 11 + court * 5;
        const isMine = seed % 9 === 0;
        const isReserved = !isMine && seed % 4 === 0;

        return {
          id: `${day}-${slot.key}-court-${court}`,
          day,
          slotKey: slot.key,
          court,
          status: isMine ? 'mine' : isReserved ? 'reserved' : 'free',
          reservedBy: isMine
            ? 'You'
            : isReserved
              ? `Member ${String.fromCharCode(64 + court)}${dayIndex + 1}`
              : undefined,
        };
      }),
    ),
);

const statusStyles: Record<ReservationStatus, string> = {
  free: 'border-emerald-200 bg-emerald-50/90 text-emerald-900 hover:border-emerald-400 hover:bg-emerald-100',
  reserved: 'border-slate-200 bg-slate-100/85 text-slate-500',
  mine: 'border-amber-300 bg-amber-100/90 text-amber-950',
};

export function DashboardPage() {
  const user = useAccountUser();
  const [selectedDay, setSelectedDay] = useState<DayLabel>('Monday');
  const [reservations, setReservations] =
    useState<ReservationCell[]>(initialReservations);

  const nextFreeReservationCount = reservations.filter(
    (reservation) => reservation.status === 'free',
  ).length;
  const ownedReservationCount = reservations.filter(
    (reservation) => reservation.status === 'mine',
  ).length;

  function reserveSlot(targetId: string) {
    setReservations((currentReservations) =>
      currentReservations.map((reservation) =>
        reservation.id === targetId && reservation.status === 'free'
          ? {
              ...reservation,
              status: 'mine',
              reservedBy: user.name,
            }
          : reservation,
      ),
    );
  }

  function getReservation(
    day: DayLabel,
    slotKey: TimeSlot['key'],
    court: CourtNumber,
  ) {
    return reservations.find(
      (reservation) =>
        reservation.day === day &&
        reservation.slotKey === slotKey &&
        reservation.court === court,
    );
  }

  return (
    <section className="grid gap-6">
      <Card className="border border-slate-900/10 bg-[#fffaf1]/92 py-0 shadow-[0_1rem_3rem_rgba(71,46,21,0.12)]">
        <CardHeader className="gap-3 border-b border-slate-900/10 px-6 py-6">
          <p className="text-[0.8rem] font-bold uppercase tracking-[0.18em] text-amber-800">
            Dashboard Page
          </p>
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <CardTitle className="text-[clamp(2rem,5vw,3.25rem)] leading-[0.94] text-slate-900">
                Weekly Court Planner
              </CardTitle>
              <CardDescription className="mt-2 max-w-2xl text-sm leading-6 text-slate-900/68">
                Fake reservation data for preview only. Reserve any free
                45-minute slot between 9:00 AM and 12:00 PM across courts 1, 2,
                and 3.
              </CardDescription>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <Metric
                label="Your reservations"
                value={String(ownedReservationCount)}
              />
              <Metric
                label="Free slots left"
                value={String(nextFreeReservationCount)}
              />
              <Metric label="Visible courts" value="3" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid gap-6 px-0 py-0">
          <div className="flex gap-2 overflow-x-auto px-6 pt-6">
            {dayLabels.map((day) => (
              <Button
                className="rounded-full whitespace-nowrap"
                key={day}
                onClick={() => setSelectedDay(day)}
                size="sm"
                type="button"
                variant={selectedDay === day ? 'default' : 'outline'}
              >
                {day}
              </Button>
            ))}
          </div>
          <div className="overflow-hidden rounded-b-2xl">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-slate-900/10 bg-[#f6efe0]/80 hover:bg-[#f6efe0]/80">
                  <TableHead className="min-w-40 border-r border-slate-900/10 bg-[#f6efe0] px-6 text-slate-900">
                    Time
                  </TableHead>
                  {courts.map((court) => (
                    <TableHead
                      className="min-w-52 border-r border-slate-900/10 px-4 text-center text-slate-900 last:border-r-0"
                      key={court}
                    >
                      Court {court}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {timeSlots.map((slot) => (
                  <TableRow
                    className="border-b border-slate-900/10 bg-[#fffaf1]/92 hover:bg-[#fff6ea]"
                    key={slot.key}
                  >
                    <TableCell className="border-r border-slate-900/10 bg-[#fcf5e8] px-5 py-3.5">
                      <div className="font-semibold text-slate-900">
                        {slot.label}
                      </div>
                      <div className="mt-1 text-xs uppercase tracking-[0.08em] text-slate-900/55">
                        {slot.range}
                      </div>
                    </TableCell>
                    {courts.map((court) => (
                      <TableCell
                        className="border-r border-slate-900/10 px-3 py-3 last:border-r-0"
                        key={`${selectedDay}-${slot.key}-${court}`}
                      >
                        {(() => {
                          const reservation = getReservation(
                            selectedDay,
                            slot.key,
                            court,
                          );

                          if (!reservation) {
                            return null;
                          }

                          const isFree = reservation.status === 'free';

                          return (
                            <button
                              className={`flex w-full items-center justify-between rounded-2xl border px-3 py-2 text-left transition-colors ${
                                statusStyles[reservation.status]
                              }`}
                              disabled={!isFree}
                              onClick={() => reserveSlot(reservation.id)}
                              type="button"
                            >
                              <span>
                                <span className="block text-xs font-bold uppercase tracking-[0.12em] opacity-70">
                                  {selectedDay}
                                </span>
                                <span className="mt-1 block text-sm font-medium">
                                  {reservation.status === 'free'
                                    ? 'Available'
                                    : reservation.status === 'mine'
                                      ? 'Reserved by you'
                                      : 'Booked'}
                                </span>
                              </span>
                              <span className="text-right text-xs font-medium">
                                {reservation.status === 'free'
                                  ? 'Reserve'
                                  : reservation.reservedBy}
                              </span>
                            </button>
                          );
                        })()}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="grid gap-3 px-6 pb-6 sm:grid-cols-3">
            <LegendChip
              description="Selectable by the account owner in this preview."
              label="Free"
              tone="free"
            />
            <LegendChip
              description="Blocked by another fake member."
              label="Reserved"
              tone="reserved"
            />
            <LegendChip
              description="Already reserved by your current account."
              label="Your booking"
              tone="mine"
            />
          </div>
        </CardContent>
      </Card>
      <Card className="border border-slate-900/10 bg-[#fffaf1]/88 py-0 shadow-[0_1rem_3rem_rgba(71,46,21,0.1)]">
        <CardContent className="flex flex-col gap-4 px-6 py-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-900">
              Preview mode for {user.name}
            </p>
            <p className="mt-1 text-sm text-slate-900/65">
              No API calls yet. Reservation changes live only in local page
              state.
            </p>
          </div>
          <Button
            className="rounded-full"
            onClick={() => setReservations(initialReservations)}
            type="button"
            variant="outline"
          >
            Reset fake schedule
          </Button>
        </CardContent>
      </Card>
    </section>
  );
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
