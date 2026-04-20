import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { useCustomerSearchSuggestions } from './use-customer-search-suggestions';
import type {
  CustomerSearchResult,
  ReservationAssignmentCellProps,
} from '../components/account/reservation-cell/reservation-assignment-cell.types';

type UseReservationAssignmentCellOptions = Pick<ReservationAssignmentCellProps, 'customerName' | 'onSubmit'>;

export function useReservationAssignmentCell({ customerName, onSubmit }: UseReservationAssignmentCellOptions) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(customerName ?? '');
  const [error, setError] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerSearchResult | null>(null);
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const editorRef = useRef<HTMLDivElement | null>(null);
  const clearTimeoutRef = useRef<number | null>(null);

  const { isLoading, suggestions, trimmedValue } = useCustomerSearchSuggestions({
    enabled: isEditing,
    value,
  });

  useEffect(() => {
    if (!isEditing) {
      resetEditor(customerName);
      return;
    }

    inputRef.current?.focus();
    inputRef.current?.select();
  }, [customerName, isEditing]);

  useEffect(() => {
    setActiveSuggestionIndex(0);
  }, [isSuggestionsOpen, suggestions]);

  useEffect(() => {
    if (!isEditing || trimmedValue.length > 0 || !customerName) {
      clearPendingClear();
      return;
    }

    clearTimeoutRef.current = window.setTimeout(() => {
      void save(null, null, { closeEditor: false });
    }, 300);

    return clearPendingClear;
  }, [customerName, isEditing, trimmedValue]);

  useEffect(() => {
    function handleDocumentPointerDown(event: PointerEvent) {
      if (!editorRef.current?.contains(event.target as Node)) {
        closeEditor();
      }
    }

    document.addEventListener('pointerdown', handleDocumentPointerDown);

    return () => {
      clearPendingClear();
      document.removeEventListener('pointerdown', handleDocumentPointerDown);
    };
  }, []);

  async function save(
    customer: CustomerSearchResult | null,
    customerValue: string | null,
    options?: { closeEditor?: boolean },
  ) {
    setError('');

    try {
      await onSubmit(customer, customerValue);

      if (options?.closeEditor !== false) {
        setIsEditing(false);
      }
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Failed to save reservation.');
    }
  }

  function clearPendingClear() {
    if (clearTimeoutRef.current) {
      window.clearTimeout(clearTimeoutRef.current);
      clearTimeoutRef.current = null;
    }
  }

  function resetEditor(nextCustomerName: string | null) {
    setValue(nextCustomerName ?? '');
    setError('');
    setSelectedCustomer(null);
    setIsSuggestionsOpen(false);
    setActiveSuggestionIndex(0);
  }

  function startEditing() {
    setIsEditing(true);
  }

  function closeSuggestions() {
    setIsSuggestionsOpen(false);
    setActiveSuggestionIndex(0);
  }

  function closeEditor() {
    closeSuggestions();
    setIsEditing(false);
  }

  function cancelEditing() {
    clearPendingClear();
    resetEditor(customerName);
    setIsEditing(false);
  }

  function changeValue(nextValue: string) {
    clearPendingClear();
    setValue(nextValue);
    setSelectedCustomer(null);
    setIsSuggestionsOpen(nextValue.trim().length > 0);

    if (nextValue.trim().length === 0) {
      setActiveSuggestionIndex(0);
    }
  }

  function focusInput() {
    setIsSuggestionsOpen(true);
  }

  async function submitCurrentValue() {
    await save(selectedCustomer, trimmedValue || selectedCustomer?.name || null);
  }

  function selectCustomer(customer: CustomerSearchResult) {
    setValue(customer.name);
    setSelectedCustomer(customer);
    closeSuggestions();
    void save(customer, customer.name);
  }

  function moveActiveSuggestion(direction: 'next' | 'previous') {
    if (suggestions.length === 0) {
      return;
    }

    setIsSuggestionsOpen(true);
    setActiveSuggestionIndex((current) =>
      direction === 'next' ? Math.min(current + 1, suggestions.length - 1) : Math.max(current - 1, 0),
    );
  }

  function selectActiveSuggestion() {
    const suggestion = suggestions[activeSuggestionIndex];

    if (!suggestion) {
      return false;
    }

    void save(suggestion, suggestion.name);
    return true;
  }

  function highlightSuggestion(customerId: number) {
    const index = suggestions.findIndex((suggestion) => suggestion.id === customerId);

    if (index >= 0) {
      setActiveSuggestionIndex(index);
    }
  }

  function handleInputKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      moveActiveSuggestion('next');
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      moveActiveSuggestion('previous');
      return;
    }

    if (event.key === 'Enter') {
      event.preventDefault();

      if (isSuggestionsOpen && selectActiveSuggestion()) {
        return;
      }

      void submitCurrentValue();
      return;
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      cancelEditing();
    }
  }

  return {
    activeSuggestionIndex,
    changeValue,
    editorRef,
    error,
    focusInput,
    handleInputKeyDown,
    highlightSuggestion,
    inputRef,
    isEditing,
    isLoadingSuggestions: isLoading,
    isSuggestionsOpen,
    selectedCustomer,
    selectCustomer,
    startEditing,
    suggestions,
    trimmedValue,
    value,
  };
}
