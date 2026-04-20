import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

type ErrorPageShellProps = {
  actionLabel: string;
  actionTo: string;
  description: string;
  helperText: string;
  status: number;
  title: string;
};

export function ErrorPageShell({ actionLabel, actionTo, description, helperText, status, title }: ErrorPageShellProps) {
  return (
    <Card className="w-full max-w-3xl border-border/70 bg-background/90 shadow-[0_16px_40px_rgba(15,23,42,0.12)]">
      <CardHeader>
        <p className="text-xs font-bold tracking-[0.2em] text-slate-500 uppercase">Error {status}</p>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-slate-700">{helperText}</p>
      </CardContent>
      <CardFooter>
        <Button asChild variant="outline">
          <Link to={actionTo}>{actionLabel}</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
