import type { ReservationStatus } from './reservation-assignment-cell.types';
import { cn } from '@/lib/utils';

type ReservationAssignmentCellDisplayProps = {
  customerEmail: string | null;
  customerName: string | null;
  isSaving: boolean;
  onEdit: () => void;
  status: ReservationStatus;
};

const statusStyles: Record<ReservationStatus, string> = {
  free: 'border-emerald-800/35 bg-emerald-100 text-emerald-950 shadow-[inset_0_0_0_1px_rgba(16,185,129,0.2)] hover:border-emerald-800/45 hover:bg-emerald-200',
  reserved:
    'border-rose-800/25 bg-red-50 text-rose-950 shadow-[inset_0_0_0_1px_rgba(244,63,94,0.14)] hover:border-rose-800/35 hover:bg-rose-200',
};

const statusMeta: Record<ReservationStatus, { badge: string; label: string }> =
  {
    free: {
      badge: 'border-emerald-800/20 bg-emerald-100 text-emerald-900',
      label: 'Open',
    },
    reserved: {
      badge: 'border-rose-800/20 bg-orange-50 text-rose-900',
      label: 'Taken',
    },
  };

export function ReservationAssignmentCellDisplay({
  customerEmail,
  customerName,
  isSaving,
  onEdit,
  status,
}: ReservationAssignmentCellDisplayProps) {
  return (
    <div className="grid w-full min-w-0 gap-2">
      <button
        className={cn(
          'grid h-14 w-full min-w-0 grid-cols-[minmax(0,0.85fr)_minmax(10rem,1.65fr)] items-center gap-3 rounded-4xl border px-3 py-2 text-left transition-colors',
          statusStyles[status],
        )}
        disabled={isSaving}
        onClick={onEdit}
        type="button"
      >
        <span className="min-w-0">
          <span className="block text-sm font-medium">
            {statusMeta[status].label}
          </span>
        </span>
        <span className="min-w-0 text-right text-sm font-medium">
          {status === 'free' ? (
            <span
              className={cn(
                'inline-flex items-center rounded-full border px-2.5 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.14em]',
                statusMeta[status].badge,
              )}
            >
              Assign
            </span>
          ) : (
            <span
              className={cn(
                'inline-flex min-w-0 items-center rounded-full border px-2.5 py-1 text-[0.7rem] font-bold uppercase tracking-[0.14em] text-slate-950',
                statusMeta[status].badge,
              )}
            >
              <span className="min-w-0 whitespace-normal break-words">
                {customerName}
              </span>
            </span>
          )}
        </span>
      </button>
      {customerEmail ? (
        <p className="truncate text-xs text-slate-900/55">{customerEmail}</p>
      ) : null}
    </div>
  );
}
