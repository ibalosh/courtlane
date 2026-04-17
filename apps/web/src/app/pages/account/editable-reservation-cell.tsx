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
  free: 'border-emerald-200 bg-emerald-50/90 text-emerald-900 hover:border-emerald-400 hover:bg-emerald-100',
  reserved:
    'border-slate-200 bg-slate-100/85 text-slate-700 hover:border-slate-400 hover:bg-slate-200/75',
};

export function EditableReservationCell({
  customerEmail,
  customerName,
  dayLabel,
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

  if (isEditing) {
    return (
      <div className="grid gap-2">
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
        {error ? <p className="text-xs text-red-700">{error}</p> : null}
        <p className="text-xs text-slate-900/50">
          Enter saves. Escape cancels. Empty clears.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-2">
      <button
        className={`flex w-full items-center justify-between rounded-2xl border px-3 py-2 text-left transition-colors ${statusStyles[status]}`}
        disabled={isSaving}
        onClick={() => setIsEditing(true)}
        type="button"
      >
        <span>
          <span className="block text-xs font-bold uppercase tracking-[0.12em] opacity-70">
            {dayLabel}
          </span>
          <span className="mt-1 block text-sm font-medium">
            {status === 'free' ? 'Available' : 'Reserved'}
          </span>
        </span>
        <span className="text-right text-xs font-medium">
          {status === 'free' ? (
            'Assign'
          ) : (
            <span className="block max-w-28 truncate">{customerName}</span>
          )}
        </span>
      </button>
      {customerEmail ? (
        <p className="truncate text-xs text-slate-900/55">{customerEmail}</p>
      ) : null}
    </div>
  );
}
