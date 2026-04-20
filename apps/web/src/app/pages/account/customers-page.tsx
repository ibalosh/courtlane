import { CustomerCreateForm } from '../../components/account/customers/customer-create-form';
import { customersListQueryKey, CustomersList } from '../../components/account/customers/customers-list';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function CustomersPage() {
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
          <CardContent>
            <CustomersList />
          </CardContent>
        </Card>

        <Card className="border border-border/70 bg-background shadow-none" size="sm">
          <CardHeader>
            <CardTitle>Add Customer</CardTitle>
            <CardDescription>Add a customer and refresh the directory immediately.</CardDescription>
          </CardHeader>
          <CardContent>
            <CustomerCreateForm invalidateQueryKey={customersListQueryKey} />
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
}
