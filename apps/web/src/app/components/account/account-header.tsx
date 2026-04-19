import { Link, NavLink } from 'react-router-dom';
import { SquashBallMark } from '../squash-ball-mark';
import { cn } from '@/lib/utils';

type AccountHeaderProps = {
  isLoggingOut: boolean;
  onLogout: () => Promise<void> | void;
  userName: string;
};

export function AccountHeader({
  isLoggingOut,
  onLogout,
  userName,
}: AccountHeaderProps) {
  return (
    <header className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex items-center gap-3">
        <SquashBallMark />
        <span>
          <p className="font-heading text-2xl font-bold tracking-[-0.04em] text-slate-950">
            Courtlane
          </p>
          <p className="text-sm text-slate-700">Court reservations</p>
        </span>
      </div>
      <nav
        aria-label="Account navigation"
        className="flex flex-wrap items-center gap-2 text-sm font-medium"
      >
        <Link
          className="rounded-full px-3 py-2 text-slate-700 transition-colors hover:bg-white/45 hover:text-slate-950"
          onClick={(event) => {
            event.preventDefault();
          }}
          to="/account/dashboard-page"
        >
          Signed in: <span className="font-semibold">{userName}</span>
        </Link>
        <NavLink
          className={({ isActive }) =>
            cn(
              'rounded-full px-4 py-2 transition-all',
              isActive
                ? 'bg-slate-900 text-[#fff8ea] shadow-[0_12px_24px_rgba(15,23,42,0.14)]'
                : 'text-slate-700 hover:bg-white/45 hover:text-slate-950',
            )
          }
          to="/account/dashboard-page"
        >
          Dashboard
        </NavLink>
        <Link
          className="rounded-full px-3 py-2 text-slate-700 transition-colors hover:bg-white/45 hover:text-slate-950"
          onClick={(event) => {
            event.preventDefault();
          }}
          to="/account/dashboard-page"
        >
          Courts
        </Link>
        <Link
          aria-disabled={isLoggingOut}
          className={cn(
            'rounded-full px-3 py-2 transition-colors',
            isLoggingOut
              ? 'pointer-events-none text-slate-400'
              : 'text-slate-700 hover:bg-white/45 hover:text-slate-950',
          )}
          onClick={async (event) => {
            event.preventDefault();
            await onLogout();
          }}
          to="/login"
        >
          {isLoggingOut ? 'Logging out...' : 'Log out'}
        </Link>
      </nav>
    </header>
  );
}
