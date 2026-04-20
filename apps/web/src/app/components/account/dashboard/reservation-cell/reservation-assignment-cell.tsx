import { useReservationAssignmentCell } from '../../../../hooks/use-reservation-assignment-cell';
import { ReservationAssignmentCellDisplay } from './reservation-assignment-cell-display';
import { ReservationAssignmentCellEditor } from './reservation-assignment-cell-editor';
import type { ReservationAssignmentCellProps } from './reservation-assignment-cell.types';

export function ReservationAssignmentCell({
  customerEmail,
  customerName,
  dayLabel,
  isSaving = false,
  onSubmit,
  status,
}: ReservationAssignmentCellProps) {
  const {
    activeSuggestionIndex,
    changeValue,
    editorRef,
    error,
    focusInput,
    handleInputKeyDown,
    highlightSuggestion,
    inputRef,
    isEditing,
    isLoadingSuggestions,
    isSuggestionsOpen,
    selectedCustomer,
    selectCustomer,
    startEditing,
    suggestions,
    trimmedValue,
    value,
  } = useReservationAssignmentCell({
    customerName,
    onSubmit,
  });

  return isEditing ? (
    <div ref={editorRef}>
      <ReservationAssignmentCellEditor
        activeSuggestionIndex={activeSuggestionIndex}
        customerEmail={customerEmail}
        error={error}
        inputRef={inputRef}
        isLoadingSuggestions={isLoadingSuggestions}
        isSuggestionsOpen={isSuggestionsOpen}
        onChange={changeValue}
        onFocus={focusInput}
        onHighlightSuggestion={highlightSuggestion}
        onKeyDown={handleInputKeyDown}
        onSelectCustomer={selectCustomer}
        placeholder={`Type customer for ${dayLabel}`}
        selectedCustomer={selectedCustomer}
        suggestions={suggestions}
        trimmedValue={trimmedValue}
        value={value}
      />
    </div>
  ) : (
    <ReservationAssignmentCellDisplay
      customerEmail={customerEmail}
      customerName={customerName}
      isSaving={isSaving}
      onEdit={startEditing}
      status={status}
    />
  );
}
