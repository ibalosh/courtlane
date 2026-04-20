import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

type AuthPageProps = {
  altAction: string;
  altLabel: string;
  children: ReactNode;
  description: string;
  title: string;
  altPath: '/login' | '/signup';
};

export function AuthPage({ altAction, altLabel, altPath, children, description, title }: AuthPageProps) {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f7f1e7_0%,#efe5d1_52%,#d7e0c8_100%)] flex items-center justify-center px-4 py-8 text-slate-950">
      <Card className="w-full max-w-md border-border/70 bg-background/90 shadow-[0_16px_40px_rgba(15,23,42,0.12)]">
        <CardHeader>
          <Button asChild className="p-0" variant="link">
            <Link to="/">Back to home</Link>
          </Button>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>{children}</CardContent>
        <div className="px-6 pb-6">
          <p className="text-muted-foreground text-sm">
            {altLabel}{' '}
            <Button asChild className="p-0" size={null} variant="link">
              <Link to={altPath}>{altAction}</Link>
            </Button>
          </p>
        </div>
      </Card>
    </main>
  );
}
