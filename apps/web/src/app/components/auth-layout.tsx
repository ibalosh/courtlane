import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

type AuthLayoutProps = {
  title: string;
  description: string;
  altLabel: string;
  altHref: string;
  altAction: string;
  children: ReactNode;
};

export function AuthLayout({
  title,
  description,
  altLabel,
  altHref,
  altAction,
  children,
}: AuthLayoutProps) {
  return (
    <main className="app-page-shell relative flex items-center justify-center overflow-hidden px-4 py-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0,_transparent_60%,_rgba(15,23,42,0.06)_100%)]" />
      <Card className="relative z-10 w-full max-w-md bg-background/90 shadow-[0_1.5rem_4rem_rgba(71,46,21,0.14)] backdrop-blur-[12px]">
        <CardHeader>
          <Button asChild className="w-fit px-0" variant="link">
            <Link to="/">Back to home</Link>
          </Button>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>{children}</CardContent>
        <CardFooter>
          <p className="text-muted-foreground text-sm">
            {altLabel}{' '}
            <Button asChild className="h-auto px-0" size={null} variant="link">
              <Link to={altHref}>{altAction}</Link>
            </Button>
          </p>
        </CardFooter>
      </Card>
    </main>
  );
}
