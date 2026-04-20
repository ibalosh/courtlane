import type { Customer, DeleteCustomer } from './customers-types';
import { Button } from '@/components/ui/button';

type CustomerCardViewProps = {
  customer: Customer;
  deletingCustomerId: number | null;
  deleteError: string | null;
  deleteErrorCustomerId: number | null;
  onDelete: DeleteCustomer;
  onEdit: () => void;
};

export function CustomerCardView({
  customer,
  deletingCustomerId,
  deleteError,
  deleteErrorCustomerId,
  onDelete,
  onEdit,
}: CustomerCardViewProps) {
  const isDeleting = deletingCustomerId === customer.id;
  const showDeleteError = deleteErrorCustomerId === customer.id && deleteError;

  return (
    <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start">
      <div>
        <p className="font-medium text-slate-950">{customer.name}</p>
        <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-600">
          <span>{customer.email ?? 'No email on file'}</span>
          <span>{customer.phone ?? 'No phone on file'}</span>
        </div>
        {showDeleteError ? <p className="mt-2 text-sm text-destructive">{showDeleteError}</p> : null}
      </div>
      <div className="flex flex-wrap justify-start gap-2 sm:justify-end">
        <Button disabled={isDeleting} onClick={() => void onDelete(customer.id)} size="sm" type="button" variant="outline">
          {isDeleting ? 'Deleting...' : 'Delete'}
        </Button>
        <Button onClick={onEdit} size="sm" type="button" variant="outline">
          Edit
        </Button>
      </div>
    </div>
  );
}
