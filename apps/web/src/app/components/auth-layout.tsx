import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';

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
    <main className="grid min-h-screen place-items-center bg-[radial-gradient(circle_at_top,_rgba(242,201,76,0.45),_transparent_32%),linear-gradient(180deg,_#f6f1e9_0%,_#ece5d9_100%)] px-4 py-8 text-slate-900">
      <Card className="w-full max-w-[30rem]">
        <CardHeader>
          <Link
            className="mb-4 inline-flex w-fit text-sm font-medium text-slate-700 transition-colors hover:text-slate-950"
            to="/"
          >
            ← Back to home
          </Link>
          <p className="mb-2 text-[0.85rem] font-bold uppercase tracking-[0.16em] text-amber-800">
            Courtlane
          </p>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          {children}
          <p className="mt-5 text-slate-900/70">
            {altLabel} <Link to={altHref}>{altAction}</Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
