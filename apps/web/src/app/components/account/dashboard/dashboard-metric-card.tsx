import { Card, CardContent } from '@/components/ui/card';

type DashboardMetricCardProps = {
  label: string;
  value: string;
};

export function DashboardMetricCard({ label, value }: DashboardMetricCardProps) {
  return (
    <Card className="gap-2 py-4 shadow-none bg-amber-50" size="sm">
      <CardContent className="space-y-1">
        <p className="text-muted-foreground text-xs font-semibold uppercase tracking-[0.16em]">{label}</p>
        <p className="font-heading text-2xl text-foreground">{value}</p>
      </CardContent>
    </Card>
  );
}
