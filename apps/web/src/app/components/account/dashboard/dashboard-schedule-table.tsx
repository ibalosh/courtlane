import { ReservationAssignmentCell } from '@/app/components/account/dashboard/reservation-cell/reservation-assignment-cell';
import { formatSlotRange } from '@/app/pages/account/dashboard-page.utils';
import type {
  DashboardReservationMap,
  DashboardSchedule,
  DashboardSelectedDay,
  DashboardSubmitReservation,
} from './dashboard-types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

type DashboardScheduleTableProps = {
  isSaving: boolean;
  reservationMap: DashboardReservationMap;
  schedule: DashboardSchedule;
  selectedDay: DashboardSelectedDay;
  submitReservation: DashboardSubmitReservation;
};

export function DashboardScheduleTable({
  isSaving,
  reservationMap,
  schedule,
  selectedDay,
  submitReservation,
}: DashboardScheduleTableProps) {
  if (!schedule || !selectedDay) {
    return null;
  }

  return (
    <div className="overflow-visible rounded-2xl border bg-background">
      <Table className="table-fixed">
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50">
            <TableHead className="w-36 border-r bg-muted/70">Time</TableHead>
            {schedule.courts.map((court) => (
              <TableHead className="border-r text-center last:border-r-0" key={court.id}>
                {court.name}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {schedule.slots.map((slot) => (
            <TableRow className="hover:bg-muted/30" key={slot.startTime}>
              <TableCell className="border-r bg-muted/20 align-middle">
                <div className="font-medium">{slot.label}</div>
                <div className="text-muted-foreground mt-1 text-xs uppercase tracking-[0.08em]">
                  {formatSlotRange(slot.startMinutes, slot.endMinutes)}
                </div>
              </TableCell>
              {schedule.courts.map((court) => {
                const reservation = reservationMap.get(`${selectedDay.date}:${slot.startTime}:${court.id}`);

                return (
                  <TableCell
                    className="border-r last:border-r-0"
                    key={`${selectedDay.date}-${slot.startTime}-${court.id}`}
                  >
                    <ReservationAssignmentCell
                      customerEmail={reservation?.customer.email ?? null}
                      customerName={reservation?.customer.name ?? null}
                      dayLabel={`${selectedDay.label} ${slot.label}`}
                      isSaving={isSaving}
                      onSubmit={(customer, customerName) =>
                        submitReservation({
                          courtId: court.id,
                          customer,
                          customerName,
                          date: selectedDay.date,
                          reservationId: reservation?.id ?? null,
                          startTime: slot.startTime,
                        })
                      }
                      status={reservation ? 'reserved' : 'free'}
                    />
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
