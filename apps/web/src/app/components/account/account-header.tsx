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
    <div className="flex items-center gap-3 p-2 justify-center">
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

type NavLinkItemProps = {
  children: ReactNode;
  to: string;
};

type NavButtonProps = {
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  onClick: () => Promise<void> | void;
};

const navItemStyle =
  'inline-flex items-center rounded-full px-3 py-2 text-slate-700 transition-colors hover:bg-white/45 hover:text-slate-950';

function getAccountNavLinkClassName({ isActive }: { isActive: boolean }) {
  return cn(
    'rounded-full px-4 py-2 transition-all',
    isActive
      ? 'bg-slate-900 text-[#fff8ea] shadow-[0_12px_24px_rgba(15,23,42,0.14)]'
      : 'text-slate-700 hover:bg-white/45 hover:text-slate-950',
  );
}

function Nav({ children }: { children: ReactNode }) {
  return (
    <nav
      aria-label="Account navigation"
      className="flex flex-wrap items-center gap-2 text-sm font-medium lg:justify-end"
    >
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

function NavLinkItem({ children, to }: NavLinkItemProps) {
  return (
    <NavLink className={getAccountNavLinkClassName} to={to}>
      {children}
    </NavLink>
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
    <header className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <BrandSection />
      <Nav>
        <NavItem className="w-full justify-center text-center sm:w-auto hidden sm:block" to="/account/dashboard">
          Signed in: <span className="font-semibold">{userName}</span>
        </NavItem>
        <div className="flex flex-wrap justify-center w-full lg:w-auto gap-2">
          <NavLinkItem to="/account/dashboard">Dashboard</NavLinkItem>
          <NavLinkItem to="/account/customers">Customers</NavLinkItem>
          <NavLinkItem to="/account/profile">Profile</NavLinkItem>
          <NavButton
            className={cn(navItemStyle, isLoggingOut ? 'pointer-events-none text-slate-400' : undefined)}
            disabled={isLoggingOut}
            onClick={onLogout}
          >
            {logoutMessage}
          </NavButton>
        </div>
      </Nav>
    </header>
  );
}
