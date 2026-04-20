import { createCustomer, deleteCustomer, getCustomers, updateCustomer } from '@/app/api/customers';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

type CustomerDraft = {
  email: string;
  name: string;
  phone: string;
};

export function CustomersPage() {
  const queryClient = useQueryClient();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [editingCustomerId, setEditingCustomerId] = useState<number | null>(null);
  const [editingDraft, setEditingDraft] = useState<CustomerDraft>({ email: '', name: '', phone: '' });

  const customersQuery = useQuery({
    queryKey: ['customers', 'list'],
    queryFn: getCustomers,
  });
  const createCustomerMutation = useMutation({
    mutationFn: createCustomer,
    onSuccess: async () => {
      setName('');
      setEmail('');
      setPhone('');
      await queryClient.invalidateQueries({ queryKey: ['customers', 'list'] });
    },
  });
  const updateCustomerMutation = useMutation({
    mutationFn: ({ id, input }: { id: number; input: CustomerDraft }) =>
      updateCustomer(id, {
        name: input.name.trim(),
        email: input.email.trim() || null,
        phone: input.phone.trim() || null,
      }),
    onSuccess: async () => {
      setEditingCustomerId(null);
      setEditingDraft({ email: '', name: '', phone: '' });
      await queryClient.invalidateQueries({ queryKey: ['customers', 'list'] });
    },
  });
  const deleteCustomerMutation = useMutation({
    mutationFn: deleteCustomer,
    onSuccess: async () => {
      if (editingCustomerId !== null) {
        cancelEditing();
      }
      await queryClient.invalidateQueries({ queryKey: ['customers', 'list'] });
    },
  });

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    await createCustomerMutation.mutateAsync({
      name: name.trim(),
      email: email.trim() || null,
      phone: phone.trim() || null,
    });
  }

  function startEditing(customer: { id: number; name: string; email: string | null; phone: string | null }) {
    setEditingCustomerId(customer.id);
    setEditingDraft({
      email: customer.email ?? '',
      name: customer.name,
      phone: customer.phone ?? '',
    });
    updateCustomerMutation.reset();
  }

  function cancelEditing() {
    setEditingCustomerId(null);
    setEditingDraft({ email: '', name: '', phone: '' });
    updateCustomerMutation.reset();
  }

  async function handleUpdateCustomer(event: React.FormEvent<HTMLFormElement>, customerId: number) {
    event.preventDefault();
    await updateCustomerMutation.mutateAsync({ id: customerId, input: editingDraft });
  }

  async function handleDeleteCustomer(customerId: number) {
    await deleteCustomerMutation.mutateAsync(customerId);
  }

  return (
    <Card className="w-full border-border/70 bg-background/90 py-0 shadow-[0_16px_40px_rgba(15,23,42,0.08)]">
      <CardHeader className="m-5 gap-3 border-b">
        <p className="text-muted-foreground text-xs font-semibold uppercase tracking-[0.16em]">Customers</p>
        <div className="max-w-2xl">
          <CardTitle className="text-[clamp(2rem,5vw,3.25rem)] leading-[0.94]">Customer Directory</CardTitle>
          <CardDescription className="mt-2 leading-6">
            A simple customer list for now, with a basic add-customer form kept in the same account layout.
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="grid gap-6 py-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="border border-border/70 bg-background shadow-none" size="sm">
          <CardHeader>
            <CardTitle>Customers</CardTitle>
            <CardDescription>Current customer records for this account.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            {customersQuery.isLoading ? <p className="text-sm text-slate-600">Loading customers...</p> : null}
            {customersQuery.isError ? <p className="text-sm text-destructive">{customersQuery.error.message}</p> : null}
            {customersQuery.data?.customers.length === 0 ? (
              <p className="text-sm text-slate-600">No customers yet.</p>
            ) : null}
            {customersQuery.data?.customers.map((customer) => (
              <div
                className="rounded-2xl border border-border/70 bg-white/70 px-4 py-3 shadow-[0_8px_24px_rgba(15,23,42,0.04)]"
                key={customer.id}
              >
                {editingCustomerId === customer.id ? (
                  <form className="grid gap-3" onSubmit={(event) => void handleUpdateCustomer(event, customer.id)}>
                    <div className="grid gap-2">
                      <Label htmlFor={`edit-customer-name-${customer.id}`}>Name</Label>
                      <Input
                        id={`edit-customer-name-${customer.id}`}
                        onChange={(event) => setEditingDraft((current) => ({ ...current, name: event.target.value }))}
                        required
                        value={editingDraft.name}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor={`edit-customer-email-${customer.id}`}>Email</Label>
                      <Input
                        id={`edit-customer-email-${customer.id}`}
                        onChange={(event) => setEditingDraft((current) => ({ ...current, email: event.target.value }))}
                        type="email"
                        value={editingDraft.email}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor={`edit-customer-phone-${customer.id}`}>Phone</Label>
                      <Input
                        id={`edit-customer-phone-${customer.id}`}
                        onChange={(event) => setEditingDraft((current) => ({ ...current, phone: event.target.value }))}
                        value={editingDraft.phone}
                      />
                    </div>
                    {updateCustomerMutation.isError ? (
                      <p className="text-sm text-destructive">{updateCustomerMutation.error.message}</p>
                    ) : null}
                    {deleteCustomerMutation.isError ? (
                      <p className="text-sm text-destructive">{deleteCustomerMutation.error.message}</p>
                    ) : null}
                    <div className="flex flex-wrap gap-2 pt-1">
                      <Button disabled={updateCustomerMutation.isPending} size="sm" type="submit">
                        {updateCustomerMutation.isPending ? 'Saving...' : 'Save'}
                      </Button>
                      <Button onClick={cancelEditing} size="sm" type="button" variant="outline">
                        Cancel
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start">
                    <div>
                      <p className="font-medium text-slate-950">{customer.name}</p>
                      <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-600">
                        <span>{customer.email ?? 'No email on file'}</span>
                        <span>{customer.phone ?? 'No phone on file'}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap justify-start gap-2 sm:justify-end">
                      <Button
                        disabled={deleteCustomerMutation.isPending}
                        onClick={() => void handleDeleteCustomer(customer.id)}
                        size="sm"
                        type="button"
                        variant="outline"
                      >
                        {deleteCustomerMutation.isPending ? 'Deleting...' : 'Delete'}
                      </Button>
                      <Button onClick={() => startEditing(customer)} size="sm" type="button" variant="outline">
                        Edit
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border border-border/70 bg-background shadow-none" size="sm">
          <CardHeader>
            <CardTitle>Add Customer</CardTitle>
            <CardDescription>Add a customer and refresh the directory immediately.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="grid gap-4" onSubmit={(event) => void handleSubmit(event)}>
              <div className="grid gap-2">
                <Label htmlFor="customer-name">Name</Label>
                <Input
                  id="customer-name"
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Jamie Lee"
                  required
                  value={name}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="customer-email">Email</Label>
                <Input
                  id="customer-email"
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="jamie@example.com"
                  type="email"
                  value={email}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="customer-phone">Phone</Label>
                <Input
                  id="customer-phone"
                  onChange={(event) => setPhone(event.target.value)}
                  placeholder="+1 555 012 3456"
                  value={phone}
                />
              </div>

              {createCustomerMutation.isError ? (
                <p className="text-sm text-destructive">{createCustomerMutation.error.message}</p>
              ) : null}

              <Button disabled={createCustomerMutation.isPending} type="submit">
                {createCustomerMutation.isPending ? 'Adding customer...' : 'Add customer'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
}
