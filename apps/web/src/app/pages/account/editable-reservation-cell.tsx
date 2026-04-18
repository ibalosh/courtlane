import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { searchCustomers } from '../../api/customers';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

type CustomerSearchResult = {
  id: number;
  name: string;
  email: string | null;
};

type ReservationStatus = 'free' | 'reserved';

type EditableReservationCellProps = {
  customerEmail: string | null;
  customerName: string | null;
  dayLabel: string;
  isSaving?: boolean;
  onSubmit: (
    customer: CustomerSearchResult | null,
    customerName: string | null,
  ) => Promise<void> | void;
  status: ReservationStatus;
};

const statusStyles: Record<ReservationStatus, string> = {
  free: 'border-emerald-800/35 bg-emerald-100 text-emerald-950 shadow-[inset_0_0_0_1px_rgba(16,185,129,0.2)] hover:border-emerald-800/45 hover:bg-emerald-200',
  reserved:
    'border-rose-800/25 bg-red-50 text-rose-950 shadow-[inset_0_0_0_1px_rgba(244,63,94,0.14)] hover:border-rose-800/35 hover:bg-rose-200',
};

const statusMeta: Record<ReservationStatus, { label: string; badge: string }> =
  {
    free: {
      label: 'Open',
      badge: 'border-emerald-800/20 bg-emerald-100 text-emerald-900',
    },
    reserved: {
      label: 'Taken',
      badge: 'border-rose-800/20 bg-orange-50  text-rose-900',
    },
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
  const [selectedCustomer, setSelectedCustomer] =
    useState<CustomerSearchResult | null>(null);
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(0);
  const [debouncedValue, setDebouncedValue] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);
  const debounceRef = useRef<number | null>(null);
  const clearRef = useRef<number | null>(null);
  const editorRef = useRef<HTMLDivElement | null>(null);

  const trimmedValue = value.trim();

  const handleSave = useCallback(
    async (
      customer: CustomerSearchResult | null,
      customerValue: string | null,
      options?: { closeEditor?: boolean },
    ) => {
      setError('');

      try {
        await onSubmit(customer, customerValue);
        if (options?.closeEditor !== false) {
          setIsEditing(false);
        }
      } catch (submitError) {
        setError(
          submitError instanceof Error
            ? submitError.message
            : 'Failed to save reservation.',
        );
      }
    },
    [onSubmit],
  );

  useEffect(() => {
    if (debounceRef.current) {
      window.clearTimeout(debounceRef.current);
    }
    if (clearRef.current) {
      window.clearTimeout(clearRef.current);
    }

    if (!isEditing || trimmedValue.length === 0) {
      setDebouncedValue('');
      if (isEditing && customerName) {
        clearRef.current = window.setTimeout(() => {
          void handleSave(null, null, { closeEditor: false });
        }, 300);
      }
      return;
    }

    debounceRef.current = window.setTimeout(() => {
      setDebouncedValue(trimmedValue);
    }, 250);
  }, [customerName, handleSave, isEditing, trimmedValue]);

  const customerSearchQuery = useQuery({
    queryKey: ['customers', 'search', debouncedValue],
    queryFn: async () => {
      const response = await searchCustomers({ query: debouncedValue });
      return response.customers.slice(0, 10);
    },
    enabled: isEditing && debouncedValue.length > 0,
    placeholderData: keepPreviousData,
  });

  const suggestions = useMemo(
    () =>
      customerSearchQuery.data?.filter((customer) =>
        customer.name.toLowerCase().includes(trimmedValue.toLowerCase()),
      ) ?? [],
    [customerSearchQuery.data, trimmedValue],
  );

  useEffect(() => {
    setActiveSuggestionIndex(0);
  }, [suggestions, isSuggestionsOpen]);

  useEffect(() => {
    if (!isEditing) {
      setValue(customerName ?? '');
      setError('');
      setSelectedCustomer(null);
      setIsSuggestionsOpen(false);
      setActiveSuggestionIndex(0);
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
    await handleSave(
      selectedCustomer,
      value.trim() || selectedCustomer?.name || null,
    );
  }

  function handleCancel() {
    setValue(customerName ?? '');
    setError('');
    setSelectedCustomer(null);
    setIsSuggestionsOpen(false);
    setActiveSuggestionIndex(0);
    setIsEditing(false);
  }

  function handleChooseCustomer(customer: CustomerSearchResult) {
    setValue(customer.name);
    setSelectedCustomer(customer);
    setIsSuggestionsOpen(false);
    setActiveSuggestionIndex(0);
    void handleSave(customer, customer.name);
  }

  function closeSuggestions() {
    setIsSuggestionsOpen(false);
    setActiveSuggestionIndex(0);
  }

  useEffect(() => {
    function handleDocumentPointerDown(event: PointerEvent) {
      if (!editorRef.current?.contains(event.target as Node)) {
        closeSuggestions();
        setIsEditing(false);
      }
    }

    document.addEventListener('pointerdown', handleDocumentPointerDown);

    return () => {
      if (debounceRef.current) {
        window.clearTimeout(debounceRef.current);
      }
      if (clearRef.current) {
        window.clearTimeout(clearRef.current);
      }
      document.removeEventListener('pointerdown', handleDocumentPointerDown);
    };
  }, []);

  const shellClassName = `grid h-14 w-full min-w-0 grid-cols-[minmax(0,0.85fr)_minmax(10rem,1.65fr)] items-center gap-3 rounded-2xl border px-3 py-2 text-left transition-colors ${statusStyles[status]}`;

  if (isEditing) {
    return (
      <div ref={editorRef}>
        <div className="relative">
          <Input
            onChange={(event) => {
              const nextValue = event.target.value;
              setValue(nextValue);
              setSelectedCustomer(null);
              setIsSuggestionsOpen(nextValue.trim().length > 0);
              if (clearRef.current) {
                window.clearTimeout(clearRef.current);
              }
              if (nextValue.trim().length === 0) {
                setActiveSuggestionIndex(0);
              }
            }}
            onFocus={() => setIsSuggestionsOpen(true)}
            onKeyDown={(event) => {
              if (event.key === 'ArrowDown') {
                if (suggestions.length > 0) {
                  event.preventDefault();
                  setIsSuggestionsOpen(true);
                  setActiveSuggestionIndex((current) =>
                    Math.min(current + 1, suggestions.length - 1),
                  );
                }
                return;
              }

              if (event.key === 'ArrowUp') {
                if (suggestions.length > 0) {
                  event.preventDefault();
                  setIsSuggestionsOpen(true);
                  setActiveSuggestionIndex((current) =>
                    Math.max(current - 1, 0),
                  );
                }
                return;
              }

              if (event.key === 'Enter') {
                event.preventDefault();
                if (isSuggestionsOpen && suggestions[activeSuggestionIndex]) {
                  void handleSave(
                    suggestions[activeSuggestionIndex],
                    suggestions[activeSuggestionIndex].name,
                  );
                  return;
                }

                void handleSubmit();
                return;
              }

              if (event.key === 'Escape') {
                event.preventDefault();
                if (clearRef.current) {
                  window.clearTimeout(clearRef.current);
                }
                handleCancel();
              }
            }}
            placeholder={`Type customer for ${dayLabel}`}
            ref={inputRef}
            value={value}
          />
          {isSuggestionsOpen && trimmedValue.length > 0 ? (
            <div className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-20 overflow-hidden rounded-3xl border border-slate-900/10 bg-white shadow-[0_18px_40px_rgba(15,23,42,0.14)]">
              <div className="border-b border-slate-900/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                Top matches
              </div>
              <div className="min-h-24">
                {customerSearchQuery.isLoading && suggestions.length > 0 ? (
                  <div className="pointer-events-none absolute inset-x-0 top-11 flex items-center justify-end px-4">
                    <span className="rounded-full bg-white/90 px-3 py-1 text-[0.7rem] font-medium text-slate-500 shadow-sm">
                      Searching...
                    </span>
                  </div>
                ) : null}
                {suggestions.length > 0 ? (
                  <ul className="max-h-72 overflow-auto p-2">
                    {suggestions.map((customer) => {
                      const isSelected = selectedCustomer?.id === customer.id;
                      const isActive =
                        suggestions[activeSuggestionIndex]?.id === customer.id;

                      return (
                        <li key={customer.id}>
                          <button
                            className={cn(
                              'flex w-full flex-col rounded-2xl px-3 py-2 text-left transition-colors hover:bg-slate-100',
                              isSelected && 'bg-slate-100',
                              isActive &&
                                'bg-slate-100 ring-2 ring-slate-900/10',
                            )}
                            onPointerDown={(event) => {
                              event.preventDefault();
                              handleChooseCustomer(customer);
                            }}
                            onMouseEnter={() =>
                              setActiveSuggestionIndex(
                                suggestions.findIndex(
                                  (suggestion) => suggestion.id === customer.id,
                                ),
                              )
                            }
                            type="button"
                          >
                            <span className="text-sm font-medium text-slate-900">
                              {customer.name}
                            </span>
                            {customer.email ? (
                              <span className="text-xs text-slate-600">
                                {customer.email}
                              </span>
                            ) : (
                              <span className="text-xs text-slate-600">
                                No email on file
                              </span>
                            )}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                ) : customerSearchQuery.isLoading ? (
                  <p className="px-4 py-3 text-sm text-slate-600">
                    Searching...
                  </p>
                ) : (
                  <p className="px-4 py-3 text-sm text-slate-600">
                    No existing customers match "{trimmedValue}". Keep typing to
                    create a new name.
                  </p>
                )}
              </div>
            </div>
          ) : null}
        </div>
        {error ? <p className="text-xs text-red-700">{error}</p> : null}
        {customerEmail ? (
          <p className="truncate text-xs text-slate-900/55">{customerEmail}</p>
        ) : null}
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
                'inline-flex min-w-0 items-center rounded-full border px-2.5 py-1 text-[0.7rem] font-bold uppercase tracking-[0.14em] text-slate-950 ',
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
