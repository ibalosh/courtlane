import type { CustomerDraft, DeleteCustomer, UpdateCustomer } from './customers-types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState, SubmitEvent } from 'react';

type CustomerCardEditFormProps = {
  customer: {
    email: string | null;
    id: number;
    name: string;
    phone: string | null;
  };
  customerId: number;
  deleteError: string | null;
  deletingCustomerId: number | null;
  onCancel: () => void;
  onDelete: DeleteCustomer;
  onSubmit: UpdateCustomer;
  saveError: string | null;
  savePending: boolean;
};

export function CustomerCardEditForm({
  customer,
  customerId,
  deleteError,
  deletingCustomerId,
  onCancel,
  onDelete,
  onSubmit,
  saveError,
  savePending,
}: CustomerCardEditFormProps) {
  const [draft, setDraft] = useState<CustomerDraft>({
    email: customer.email ?? '',
    name: customer.name,
    phone: customer.phone ?? '',
  });

  async function handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    await onSubmit(customerId, draft);
  }

  return (
    <form className="grid gap-3" onSubmit={(event) => void handleSubmit(event)}>
      <div className="grid gap-2">
        <Label htmlFor={`edit-customer-name-${customerId}`}>Name</Label>
        <Input
          aria-label={`edit-customer-name-${customerId}`}
          id={`edit-customer-name-${customerId}`}
          onChange={(event) => setDraft({ ...draft, name: event.target.value })}
          required
          value={draft.name}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor={`edit-customer-email-${customerId}`}>Email</Label>
        <Input
          aria-label={`edit-customer-email-${customerId}`}
          id={`edit-customer-email-${customerId}`}
          onChange={(event) => setDraft({ ...draft, email: event.target.value })}
          type="email"
          value={draft.email}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor={`edit-customer-phone-${customerId}`}>Phone</Label>
        <Input
          aria-label={`edit-customer-phone-${customerId}`}
          id={`edit-customer-phone-${customerId}`}
          onChange={(event) => setDraft({ ...draft, phone: event.target.value })}
          value={draft.phone}
        />
      </div>
      {saveError ? <p className="text-sm text-destructive">{saveError}</p> : null}
      {deleteError ? <p className="text-sm text-destructive">{deleteError}</p> : null}
      <div className="flex flex-wrap gap-2 pt-1">
        <Button disabled={savePending} size="sm" type="submit">
          {savePending ? 'Saving...' : 'Save'}
        </Button>
        <Button onClick={onCancel} size="sm" type="button" variant="outline">
          Cancel
        </Button>
        <Button
          disabled={deletingCustomerId === customerId}
          onClick={() => void onDelete(customerId)}
          size="sm"
          type="button"
          variant="outline"
        >
          {deletingCustomerId === customerId ? 'Deleting...' : 'Delete'}
        </Button>
      </div>
    </form>
  );
}
