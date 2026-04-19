import type { KeyboardEvent, RefObject } from 'react';
import { ReservationAssignmentCellSuggestions } from './reservation-assignment-cell-suggestions';
import type { CustomerSearchResult } from './reservation-assignment-cell.types';
import { Input } from '@/components/ui/input';

type ReservationAssignmentCellEditorProps = {
  activeSuggestionIndex: number;
  customerEmail: string | null;
  error: string;
  inputRef: RefObject<HTMLInputElement | null>;
  isLoadingSuggestions: boolean;
  isSuggestionsOpen: boolean;
  onChange: (value: string) => void;
  onFocus: () => void;
  onHighlightSuggestion: (customerId: number) => void;
  onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
  onSelectCustomer: (customer: CustomerSearchResult) => void;
  placeholder: string;
  selectedCustomer: CustomerSearchResult | null;
  suggestions: CustomerSearchResult[];
  trimmedValue: string;
  value: string;
};

export function ReservationAssignmentCellEditor({
  activeSuggestionIndex,
  customerEmail,
  error,
  inputRef,
  isLoadingSuggestions,
  isSuggestionsOpen,
  onChange,
  onFocus,
  onHighlightSuggestion,
  onKeyDown,
  onSelectCustomer,
  placeholder,
  selectedCustomer,
  suggestions,
  trimmedValue,
  value,
}: ReservationAssignmentCellEditorProps) {
  const showSuggestions = isSuggestionsOpen && trimmedValue.length > 0;

  return (
    <div>
      <div className="relative">
        <Input
          className="h-14"
          onChange={(event) => onChange(event.target.value)}
          onFocus={onFocus}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          ref={inputRef}
          value={value}
        />
        {showSuggestions ? (
          <ReservationAssignmentCellSuggestions
            activeSuggestionIndex={activeSuggestionIndex}
            isLoading={isLoadingSuggestions}
            onHighlightSuggestion={onHighlightSuggestion}
            onSelectCustomer={onSelectCustomer}
            selectedCustomer={selectedCustomer}
            suggestions={suggestions}
            trimmedValue={trimmedValue}
          />
        ) : null}
      </div>
      {error ? <p className="text-xs text-red-700">{error}</p> : null}
      {customerEmail ? (
        <p className="truncate text-xs text-slate-900/55">{customerEmail}</p>
      ) : null}
    </div>
  );
}
