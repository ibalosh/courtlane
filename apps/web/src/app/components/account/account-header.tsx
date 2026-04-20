import type { ReactNode } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { SquashBallMark } from '../squash-ball-mark';
import { cn } from '@/lib/utils';

type AccountHeaderProps = {
  isLoggingOut: boolean;
  onLogout: () => Promise<void> | void;
  userName: string;
};

function BrandSection() {
  return (
    <div className="flex items-center gap-3">
      <SquashBallMark />
      <div>
        <p className="font-heading text-2xl font-bold tracking-[-0.04em] text-slate-950">Courtlane</p>
        <p className="text-sm text-slate-700">Court reservations</p>
      </div>
    </div>
  );
}

type NavItemProps = {
  children: ReactNode;
  className?: string;
  to: string;
};

type NavButtonProps = {
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  onClick: () => Promise<void> | void;
};

const navItemStyle =
  'cursor-pointer rounded-full px-3 py-2 text-slate-700 transition-colors hover:bg-white/45 hover:text-slate-950';

function Nav({ children }: { children: ReactNode }) {
  return (
    <nav aria-label="Account navigation" className="flex flex-wrap items-center gap-2 text-sm font-medium">
      {children}
    </nav>
  );
}

function NavItem({ children, className, to }: NavItemProps) {
  return (
    <Link className={cn(navItemStyle, className)} to={to}>
      {children}
    </Link>
  );
}

function NavButton({ children, className, disabled, onClick }: NavButtonProps) {
  return (
    <button className={cn(navItemStyle, className)} disabled={disabled} onClick={onClick} type="button">
      {children}
    </button>
  );
}

export function AccountHeader({ isLoggingOut, onLogout, userName }: AccountHeaderProps) {
  const logoutMessage = isLoggingOut ? 'Logging out...' : 'Log out';

  return (
    <header className="flex flex-col lg:flex-row lg:justify-between">
      <BrandSection />
      <Nav>
        <NavItem to="/account/dashboard">
          Signed in: <span className="font-semibold">{userName}</span>
        </NavItem>
        <NavLink
          className={({ isActive }) =>
            cn(
              'rounded-full px-4 py-2 transition-all',
              isActive
                ? 'bg-slate-900 text-[#fff8ea] shadow-[0_12px_24px_rgba(15,23,42,0.14)]'
                : 'text-slate-700 hover:bg-white/45 hover:text-slate-950',
            )
          }
          to="/account/dashboard"
        >
          Dashboard
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            cn(
              'rounded-full px-4 py-2 transition-all',
              isActive
                ? 'bg-slate-900 text-[#fff8ea] shadow-[0_12px_24px_rgba(15,23,42,0.14)]'
                : 'text-slate-700 hover:bg-white/45 hover:text-slate-950',
            )
          }
          to="/account/customers"
        >
          Customers
        </NavLink>
        <NavButton
          className={cn(navItemStyle, isLoggingOut ? 'pointer-events-none text-slate-400' : undefined)}
          disabled={isLoggingOut}
          onClick={onLogout}
        >
          {logoutMessage}
        </NavButton>
      </Nav>
    </header>
  );
}
