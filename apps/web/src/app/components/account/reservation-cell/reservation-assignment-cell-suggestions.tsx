import type { CustomerSearchResult } from './reservation-assignment-cell.types';
import { cn } from '@/lib/utils';

type ReservationAssignmentCellSuggestionsProps = {
  activeSuggestionIndex: number;
  isLoading: boolean;
  onHighlightSuggestion: (customerId: number) => void;
  onSelectCustomer: (customer: CustomerSearchResult) => void;
  selectedCustomer: CustomerSearchResult | null;
  suggestions: CustomerSearchResult[];
  trimmedValue: string;
};

export function ReservationAssignmentCellSuggestions({
  activeSuggestionIndex,
  isLoading,
  onHighlightSuggestion,
  onSelectCustomer,
  selectedCustomer,
  suggestions,
  trimmedValue,
}: ReservationAssignmentCellSuggestionsProps) {
  return (
    <div className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-20 overflow-hidden rounded-3xl border border-slate-900/10 bg-white shadow-[0_18px_40px_rgba(15,23,42,0.14)]">
      <div className="border-b border-slate-900/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
        Top matches
      </div>
      <div className="min-h-24">
        {isLoading && suggestions.length > 0 ? (
          <div className="pointer-events-none absolute inset-x-0 top-11 flex items-center justify-end px-4">
            <span className="rounded-full bg-white/90 px-3 py-1 text-[0.7rem] font-medium text-slate-500 shadow-sm">
              Searching...
            </span>
          </div>
        ) : null}
        {suggestions.length > 0 ? (
          <ul className="max-h-72 overflow-auto p-2">
            {suggestions.map((customer, index) => {
              const isActive = activeSuggestionIndex === index;
              const isSelected = selectedCustomer?.id === customer.id;

              return (
                <li key={customer.id}>
                  <button
                    className={cn(
                      'flex w-full flex-col rounded-2xl px-3 py-2 text-left transition-colors hover:bg-slate-100',
                      isSelected && 'bg-slate-100',
                      isActive && 'bg-slate-100 ring-2 ring-slate-900/10',
                    )}
                    onMouseEnter={() => onHighlightSuggestion(customer.id)}
                    onPointerDown={(event) => {
                      event.preventDefault();
                      onSelectCustomer(customer);
                    }}
                    type="button"
                  >
                    <span className="text-sm font-medium text-slate-900">
                      {customer.name}
                    </span>
                    <span className="text-xs text-slate-600">
                      {customer.email ?? 'No email on file'}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        ) : isLoading ? (
          <p className="px-4 py-3 text-sm text-slate-600">Searching...</p>
        ) : (
          <p className="px-4 py-3 text-sm text-slate-600">
            No existing customers match "{trimmedValue}". Keep typing to create
            a new name.
          </p>
        )}
      </div>
    </div>
  );
}
