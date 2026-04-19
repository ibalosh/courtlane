import { useEffect, useMemo, useState } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { searchCustomers } from '../api/customers';

type UseCustomerSearchSuggestionsOptions = {
  enabled: boolean;
  value: string;
};

export function useCustomerSearchSuggestions({
  enabled,
  value,
}: UseCustomerSearchSuggestionsOptions) {
  const [debouncedValue, setDebouncedValue] = useState('');
  const trimmedValue = value.trim();

  useEffect(() => {
    if (!enabled || trimmedValue.length === 0) {
      setDebouncedValue('');
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setDebouncedValue(trimmedValue);
    }, 250);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [enabled, trimmedValue]);

  const query = useQuery({
    queryKey: ['customers', 'search', debouncedValue],
    queryFn: async () => {
      const response = await searchCustomers({ query: debouncedValue });
      return response.customers.slice(0, 10);
    },
    enabled: enabled && debouncedValue.length > 0,
    placeholderData: keepPreviousData,
  });

  const suggestions = useMemo(
    () =>
      query.data?.filter((customer) =>
        customer.name.toLowerCase().includes(trimmedValue.toLowerCase()),
      ) ?? [],
    [query.data, trimmedValue],
  );

  return {
    isLoading: query.isLoading,
    suggestions,
    trimmedValue,
  };
}
