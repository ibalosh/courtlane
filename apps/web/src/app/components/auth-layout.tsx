import { ReactNode } from 'react';
import { Link } from 'react-router-dom';

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
      <section className="w-full max-w-[30rem] rounded-3xl border border-slate-900/12 bg-[#fffcf6]/92 p-8 shadow-[0_1.5rem_4rem_rgba(71,46,21,0.14)] backdrop-blur-[12px] sm:p-6">
        <p className="mb-2 text-[0.85rem] font-bold uppercase tracking-[0.16em] text-amber-800">
          Courtlane
        </p>
        <h1 className="text-[clamp(2rem,5vw,3rem)] leading-[0.98] font-semibold">
          {title}
        </h1>
        <p className="mt-4 text-slate-900/70">{description}</p>
        {children}
        <p className="mt-5 text-slate-900/70">
          {altLabel} <Link to={altHref}>{altAction}</Link>
        </p>
      </section>
    </main>
  );
}
