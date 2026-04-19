import { Card, CardFooter } from '@/components/ui/card';

type DashboardFooterProps = {
  userName: string;
};

export function DashboardFooter({ userName }: DashboardFooterProps) {
  return (
    <Card>
      <CardFooter className="m-3">
        <div className="space-y-1">
          <p className="text-sm font-medium">Live schedule for {userName}</p>
          <p className="text-muted-foreground text-sm">
            Click a slot to edit it in place. Press Enter to save, Escape to
            cancel, and clear the field to remove an existing reservation.
          </p>
        </div>
      </CardFooter>
    </Card>
  );
}
