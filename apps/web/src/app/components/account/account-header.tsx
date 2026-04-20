import React, { ReactNode } from 'react';
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
  'aria-disabled'?: boolean;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
  to: string;
};

function NavItem({ children, className, onClick, to, ...rest }: NavItemProps) {
  const defaultStyle = 'rounded-full px-3 py-2 text-slate-700 transition-colors hover:bg-white/45 hover:text-slate-950';
  return (
    <Link {...rest} className={cn(defaultStyle, className)} onClick={onClick} to={to}>
      {children}
    </Link>
  );
}

export function AccountHeader({ isLoggingOut, onLogout, userName }: AccountHeaderProps) {
  async function handleLogoutClick(event: React.MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    await onLogout();
  }

  const logoutMessage = isLoggingOut ? 'Logging out...' : 'Log out';

  return (
    <header className="flex flex-col lg:flex-row lg:justify-between">
      <BrandSection />
      <nav aria-label="Account navigation" className="flex flex-wrap items-center gap-2 text-sm font-medium">
        <NavItem to="/account/dashboard-page">
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
          to="/account/dashboard-page"
        >
          Dashboard
        </NavLink>
        <NavItem to="/account/dashboard-page">Courts</NavItem>
        <NavItem
          aria-disabled={isLoggingOut}
          className={cn(isLoggingOut ? 'pointer-events-none text-slate-400' : undefined)}
          onClick={handleLogoutClick}
          to="/login"
        >
          {logoutMessage}
        </NavItem>
      </nav>
    </header>
  );
}
