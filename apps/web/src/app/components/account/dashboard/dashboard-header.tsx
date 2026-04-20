import type { DashboardMetrics as DashboardMetricsType } from './dashboard-types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

type DashboardHeaderProps = {
  metrics: DashboardMetricsType;
};

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

export function DashboardHeader({ metrics }: DashboardHeaderProps) {
  return (
    <CardHeader className="gap-3 border-b m-5">
      <p className="text-muted-foreground text-xs font-semibold uppercase tracking-[0.16em]">Dashboard</p>
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0 flex-1">
          <CardTitle className="text-[clamp(2rem,5vw,3.25rem)] leading-[0.94]">Weekly Court Planner</CardTitle>
          <CardDescription className="mt-2 max-w-2xl leading-6">
            <p>View the live weekly schedule. Click a slot to edit it directly.</p>
          </CardDescription>
        </div>
        <div className="shrink-0">
          <div className="grid gap-3 sm:grid-cols-3">
            <DashboardMetricCard label="Reserved slots" value={String(metrics.reservedSlots)} />
            <DashboardMetricCard label="Free slots" value={String(metrics.freeSlots)} />
            <DashboardMetricCard label="Active courts" value={String(metrics.activeCourts)} />
          </div>
        </div>
      </div>
    </CardHeader>
  );
}
