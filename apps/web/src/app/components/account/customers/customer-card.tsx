import { deleteCustomer, updateCustomer } from '@/app/api/customers';
import { CustomerCardEditForm } from './customer-card-edit-form';
import { CustomerCardView } from './customer-card-view';
import type { Customer, CustomerDraft } from './customers-types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

type CustomerCardProps = {
  customer: Customer;
  invalidateQueryKey: readonly unknown[];
};

function normalizeDraft(draft: CustomerDraft) {
  return {
    name: draft.name.trim(),
    email: draft.email.trim() || null,
    phone: draft.phone.trim() || null,
  };
}

export function CustomerCard({ customer, invalidateQueryKey }: CustomerCardProps) {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const updateCustomerMutation = useMutation({
    mutationFn: (draft: CustomerDraft) => updateCustomer(customer.id, normalizeDraft(draft)),
    onSuccess: async () => {
      setIsEditing(false);
      await queryClient.invalidateQueries({ queryKey: invalidateQueryKey });
    },
  });
  const deleteCustomerMutation = useMutation({
    mutationFn: () => deleteCustomer(customer.id),
    onSuccess: async () => {
      setIsEditing(false);
      await queryClient.invalidateQueries({ queryKey: invalidateQueryKey });
    },
  });

  return (
    <div className="rounded-2xl border border-border/70 bg-white/70 px-4 py-3 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
      {isEditing ? (
        <CustomerCardEditForm
          customer={customer}
          customerId={customer.id}
          deleteError={deleteCustomerMutation.isError ? deleteCustomerMutation.error.message : null}
          deletingCustomerId={deleteCustomerMutation.isPending ? customer.id : null}
          onCancel={() => setIsEditing(false)}
          onDelete={async () => {
            await deleteCustomerMutation.mutateAsync();
          }}
          onSubmit={async (customerId, draft) => {
            void customerId;
            await updateCustomerMutation.mutateAsync(draft);
          }}
          saveError={updateCustomerMutation.isError ? updateCustomerMutation.error.message : null}
          savePending={updateCustomerMutation.isPending}
        />
      ) : (
        <CustomerCardView
          customer={customer}
          deleteError={deleteCustomerMutation.isError ? deleteCustomerMutation.error.message : null}
          deleteErrorCustomerId={customer.id}
          deletingCustomerId={deleteCustomerMutation.isPending ? customer.id : null}
          onDelete={async () => {
            await deleteCustomerMutation.mutateAsync();
          }}
          onEdit={() => setIsEditing(true)}
        />
      )}
    </div>
  );
}
