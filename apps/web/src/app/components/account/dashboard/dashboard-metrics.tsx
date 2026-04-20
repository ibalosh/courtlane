import type { DashboardMetrics as DashboardMetricsType } from './dashboard-types';
import { DashboardMetricCard } from './dashboard-metric-card';

type DashboardMetricsProps = {
  metrics: DashboardMetricsType;
};

export function DashboardMetrics({ metrics }: DashboardMetricsProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <DashboardMetricCard label="Reserved slots" value={String(metrics.reservedSlots)} />
      <DashboardMetricCard label="Free slots" value={String(metrics.freeSlots)} />
      <DashboardMetricCard label="Active courts" value={String(metrics.activeCourts)} />
    </div>
  );
}
