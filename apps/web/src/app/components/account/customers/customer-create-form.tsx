import { createCustomer } from '@/app/api/customers';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, SubmitEvent } from 'react';
import type { CustomerDraft } from './customers-types';

type CustomerCreateFormProps = {
  invalidateQueryKey: readonly unknown[];
  onCreated?: () => void;
};

const emptyDraft: CustomerDraft = {
  email: '',
  name: '',
  phone: '',
};

function normalizeDraft(draft: CustomerDraft) {
  return {
    name: draft.name.trim(),
    email: draft.email.trim() || null,
    phone: draft.phone.trim() || null,
  };
}

export function CustomerCreateForm({ invalidateQueryKey, onCreated }: CustomerCreateFormProps) {
  const queryClient = useQueryClient();
  const [draft, setDraft] = useState<CustomerDraft>(emptyDraft);
  const createCustomerMutation = useMutation({
    mutationFn: createCustomer,
    onSuccess: async () => {
      setDraft(emptyDraft);
      await queryClient.invalidateQueries({ queryKey: invalidateQueryKey });
      onCreated?.();
    },
  });

  async function handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    await createCustomerMutation.mutateAsync(normalizeDraft(draft));
  }

  return (
    <form className="grid gap-4" onSubmit={(event) => void handleSubmit(event)}>
      <div className="grid gap-2">
        <Label htmlFor="customer-name">Name</Label>
        <Input
          aria-label="Customer name"
          id="customer-name"
          onChange={(event) => setDraft({ ...draft, name: event.target.value })}
          placeholder="Jamie Lee"
          required
          value={draft.name}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="customer-email">Email</Label>
        <Input
          aria-label="Customer email"
          id="customer-email"
          onChange={(event) => setDraft({ ...draft, email: event.target.value })}
          placeholder="jamie@example.com"
          type="email"
          value={draft.email}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="customer-phone">Phone</Label>
        <Input
          aria-label="Customer phone"
          id="customer-phone"
          onChange={(event) => setDraft({ ...draft, phone: event.target.value })}
          placeholder="+1 555 012 3456"
          value={draft.phone}
        />
      </div>

      {createCustomerMutation.isError ? <p className="text-sm text-destructive">{createCustomerMutation.error.message}</p> : null}

      <Button disabled={createCustomerMutation.isPending} type="submit">
        {createCustomerMutation.isPending ? 'Adding customer...' : 'Add customer'}
      </Button>
    </form>
  );
}
