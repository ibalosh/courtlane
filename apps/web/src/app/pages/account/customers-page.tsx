import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const customers = [
  { id: 1, name: 'Jamie Lee', email: 'jamie@example.com', phone: '+1 555 012 3456' },
  { id: 2, name: 'Morgan Park', email: 'morgan@example.com', phone: '+1 555 013 2188' },
  { id: 3, name: 'Casey Brooks', email: 'casey@example.com', phone: 'No phone on file' },
];

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
          <CardContent className="grid gap-3">
            {customers.map((customer) => (
              <div
                className="rounded-2xl border border-border/70 bg-white/70 px-4 py-3 shadow-[0_8px_24px_rgba(15,23,42,0.04)]"
                key={customer.id}
              >
                <p className="font-medium text-slate-950">{customer.name}</p>
                <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-600">
                  <span>{customer.email}</span>
                  <span>{customer.phone}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border border-border/70 bg-background shadow-none" size="sm">
          <CardHeader>
            <CardTitle>Add Customer</CardTitle>
            <CardDescription>Form layout only for now. Wiring can come later.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="customer-name">Name</Label>
                <Input id="customer-name" placeholder="Jamie Lee" />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="customer-email">Email</Label>
                <Input id="customer-email" placeholder="jamie@example.com" type="email" />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="customer-phone">Phone</Label>
                <Input id="customer-phone" placeholder="+1 555 012 3456" />
              </div>

              <Button type="button">Add customer</Button>
            </form>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
}
