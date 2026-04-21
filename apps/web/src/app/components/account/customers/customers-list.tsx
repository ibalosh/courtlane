import { getCustomers } from '@/app/api/customers';
import { useQuery } from '@tanstack/react-query';
import { CustomerCard } from './customer-card';

export const customersListQueryKey = ['customers', 'list'] as const;

export function CustomersList() {
  const { isLoading, isError, error, data } = useQuery({
    queryKey: customersListQueryKey,
    queryFn: getCustomers,
  });

  if (isLoading) {
    return <p className="text-sm text-slate-600">Loading customers...</p>;
  }

  if (isError) {
    return <p className="text-sm text-destructive">{error.message}</p>;
  }

  if ((data?.customers.length ?? 0) === 0) {
    return <p className="text-sm text-slate-600">No customers yet.</p>;
  }

  return (
    <div className="grid gap-3">
      {data?.customers.map((customer) => (
        <CustomerCard customer={customer} invalidateQueryKey={customersListQueryKey} key={customer.id} />
      ))}
    </div>
  );
}
