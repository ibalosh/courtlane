import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { ReservationAssignmentCellDisplay } from './reservation-assignment-cell-display';
import { ReservationAssignmentCellSuggestions } from './reservation-assignment-cell-suggestions';
import type { CustomerSearchResult, ReservationAssignmentCellProps } from './reservation-assignment-cell.types';
import { useCustomerSearchSuggestions } from '@/app/hooks/use-customer-search-suggestions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function ReservationAssignmentCell({
  customerEmail,
  customerName,
  dayLabel,
  isSaving = false,
  onSubmit,
  status,
}: ReservationAssignmentCellProps) {
  // Keep an optimistic local draft while the user is editing the cell.
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [value, setValue] = useState(customerName ?? '');
  const [error, setError] = useState('');
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const { isLoading, suggestions, trimmedValue } = useCustomerSearchSuggestions({ enabled: isEditing, value });
  const showSuggestions = isEditing && trimmedValue.length > 0;

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    } else {
      // When the editor closes, fall back to the latest saved reservation state from the parent.
      setValue(customerName ?? '');
      setError('');
      setActiveSuggestionIndex(0);
    }
  }, [customerName, isEditing]);

  async function submitAssignment(customer: CustomerSearchResult | null, customerValue: string | null) {
    if (isSubmitting) {
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      await onSubmit(customer, customerValue);
      setValue(customerValue ?? '');
      setActiveSuggestionIndex(0);
      setIsEditing(false);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Failed to save reservation.');
    } finally {
      setIsSubmitting(false);
    }
  }

  function startEditing() {
    setError('');
    setActiveSuggestionIndex(0);
    setIsEditing(true);
  }

  function cancelEditing() {
    setValue(customerName ?? '');
    setError('');
    setActiveSuggestionIndex(0);
    setIsEditing(false);
  }

  function handleInputChange(nextValue: string) {
    setValue(nextValue);
    setActiveSuggestionIndex(0);
  }

  function handleInputKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    const keyEventToHandle = ['ArrowDown', 'ArrowUp', 'Enter', 'Escape'];

    if (keyEventToHandle.includes(event.key)) {
      event.preventDefault();
    }

    switch (event.key) {
      case 'ArrowDown':
        if (suggestions.length === 0) {
          return;
        }

        setActiveSuggestionIndex((current) => Math.min(current + 1, suggestions.length - 1));
        return;

      case 'ArrowUp':
        if (suggestions.length === 0) {
          return;
        }

        setActiveSuggestionIndex((current) => Math.max(current - 1, 0));
        return;

      case 'Enter':
        // Enter chooses the highlighted suggestion first; otherwise it submits the typed name as-is.
        if (showSuggestions && suggestions[activeSuggestionIndex]) {
          void submitAssignment(suggestions[activeSuggestionIndex], suggestions[activeSuggestionIndex].name);
          return;
        }

        void submitAssignment(null, trimmedValue || null);
        return;
      case 'Escape':
        cancelEditing();
        return;
    }
  }

  // Blurring an existing reservation after deleting the name is treated as clearing that slot.
  function handleInputBlur() {
    if (isSubmitting) {
      return;
    }

    if (trimmedValue.length === 0 && customerName) {
      void submitAssignment(null, null);
      return;
    }

    cancelEditing();
  }

  function handleSave() {
    if (showSuggestions && suggestions[activeSuggestionIndex]) {
      void submitAssignment(suggestions[activeSuggestionIndex], suggestions[activeSuggestionIndex].name);
      return;
    }

    void submitAssignment(null, trimmedValue || null);
  }

  function handleClear() {
    void submitAssignment(null, null);
  }

  if (!isEditing) {
    return (
      <ReservationAssignmentCellDisplay
        customerEmail={customerEmail}
        customerName={customerName}
        isSaving={isSaving}
        onEdit={startEditing}
        status={status}
      />
    );
  }

  return (
    <div className="relative z-30">
      <div className="relative">
        <Input
          aria-label={customerEmail || ''}
          className="h-12 sm:h-14"
          onChange={(event) => handleInputChange(event.target.value)}
          onBlur={handleInputBlur}
          onKeyDown={handleInputKeyDown}
          placeholder={`Type customer for ${dayLabel}`}
          ref={inputRef}
          disabled={isSubmitting}
          value={value}
        />
        {showSuggestions ? (
          <ReservationAssignmentCellSuggestions
            activeSuggestionIndex={activeSuggestionIndex}
            isLoading={isLoading}
            onHighlightSuggestion={setActiveSuggestionIndex}
            onSelectCustomer={(customer) => {
              setValue(customer.name);
              setActiveSuggestionIndex(0);
              void submitAssignment(customer, customer.name);
            }}
            suggestions={suggestions}
            trimmedValue={trimmedValue}
          />
        ) : null}
      </div>
      <div className="mt-2 flex flex-wrap gap-2">
        <Button
          disabled={isSubmitting}
          onMouseDown={(event) => event.preventDefault()}
          onClick={handleSave}
          size="sm"
          type="button"
        >
          Save
        </Button>
        <Button
          disabled={isSubmitting}
          onMouseDown={(event) => event.preventDefault()}
          onClick={cancelEditing}
          size="sm"
          type="button"
          variant="outline"
        >
          Cancel
        </Button>
        {status === 'reserved' ? (
          <Button
            disabled={isSubmitting}
            onMouseDown={(event) => event.preventDefault()}
            onClick={handleClear}
            size="sm"
            type="button"
            variant="outline"
          >
            Free court
          </Button>
        ) : null}
      </div>
      {error ? <p className="text-xs text-red-700">{error}</p> : null}
      {customerEmail ? <p className="truncate text-xs text-slate-900/55">{customerEmail}</p> : null}
    </div>
  );
}
