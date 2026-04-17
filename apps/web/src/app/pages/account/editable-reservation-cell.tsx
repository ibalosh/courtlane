import { useEffect, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';

type ReservationStatus = 'free' | 'reserved';

type EditableReservationCellProps = {
  customerEmail: string | null;
  customerName: string | null;
  dayLabel: string;
  isSaving?: boolean;
  onSubmit: (customerName: string | null) => Promise<void> | void;
  status: ReservationStatus;
};

const statusStyles: Record<ReservationStatus, string> = {
  free: 'border-emerald-400/50 bg-emerald-100/90 text-emerald-950 hover:border-emerald-600 hover:bg-emerald-200',
  reserved:
    'border-amber-500/60 bg-amber-200/95 text-amber-950 hover:border-amber-700 hover:bg-amber-300',
};

const editingStyles: Record<ReservationStatus, string> = {
  free: 'border-emerald-600/60 bg-emerald-200 text-emerald-950',
  reserved: 'border-amber-700/60 bg-amber-300 text-amber-950',
};

export function EditableReservationCell({
  customerEmail,
  customerName,
  isSaving = false,
  onSubmit,
  status,
}: EditableReservationCellProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(customerName ?? '');
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!isEditing) {
      setValue(customerName ?? '');
      setError('');
    }
  }, [customerName, isEditing]);

  useEffect(() => {
    if (!isEditing) {
      return;
    }

    inputRef.current?.focus();
    inputRef.current?.select();
  }, [isEditing]);

  async function handleSubmit() {
    setError('');

    try {
      await onSubmit(value.trim() || null);
      setIsEditing(false);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : 'Failed to save reservation.',
      );
    }
  }

  function handleCancel() {
    setValue(customerName ?? '');
    setError('');
    setIsEditing(false);
  }

  const shellClassName = `grid h-14 w-full min-w-0 grid-cols-[minmax(0,1fr)_minmax(0,1fr)] items-center gap-3 rounded-2xl border px-3 py-2 text-left transition-colors ${statusStyles[status]}`;

  if (isEditing) {
    return (
      <div>
        <div>
          <div>
            <Input
              onChange={(event) => setValue(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                  void handleSubmit();
                }

                if (event.key === 'Escape') {
                  event.preventDefault();
                  handleCancel();
                }
              }}
              placeholder="Type customer"
              ref={inputRef}
              value={value}
            />
          </div>
        </div>
        {error ? <p className="text-xs text-red-700">{error}</p> : null}
        {customerEmail ? (<p className="truncate text-xs text-slate-900/55">{customerEmail}</p>) : null}
      </div>
    );
  }

  return (
    <div className="grid w-full min-w-0 gap-2">
      <button
        className={shellClassName}
        disabled={isSaving}
        onClick={() => setIsEditing(true)}
        type="button"
      >
        <span className="min-w-0">
          <span className="block text-sm font-medium">
            {status === 'free' ? 'Available' : 'Reserved'}
          </span>
        </span>
        <span className="min-w-0 text-right text-sm font-medium">
          {status === 'free' ? (
            'Assign'
          ) : (
            <span className="block max-w-34 truncate font-bold">
              {customerName}
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
