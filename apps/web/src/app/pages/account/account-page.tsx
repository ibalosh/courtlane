import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Link,
  NavLink,
  Outlet,
  useNavigate,
  useOutletContext,
} from 'react-router-dom';
import { logout } from '../../api/auth';
import { cn } from '@/lib/utils';
import type { AuthUser } from '../../api/auth';
import { useAuthenticatedUser } from './account-layout';
import { SquashBallMark } from '../../components/squash-ball-mark';

type AccountOutletContext = {
  user: AuthUser;
};

export function AccountPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [error, setError] = useState('');
  const user = useAuthenticatedUser();
  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: async () => {
      queryClient.setQueryData(['auth', 'me'], { user: null });
      await navigate('/login');
    },
    onError: (logoutError) => {
      setError(
        logoutError instanceof Error ? logoutError.message : 'Logout failed.',
      );
    },
  });

  async function handleLogout() {
    setError('');
    await logoutMutation.mutateAsync();
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(242,201,76,0.5),_transparent_28%),linear-gradient(180deg,_#f7f1e4_0%,_#ece4d5_56%,_#e3d9c7_100%)] px-4 py-8 text-slate-900">
      <div className="mx-auto grid w-full max-w-[112rem] gap-6">
        <header className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <SquashBallMark />
            <div>
              <p className="font-heading text-2xl font-bold tracking-[-0.04em] text-slate-950">
                Courtlane
              </p>
              <p className="text-sm text-slate-700">Court reservations</p>
            </div>
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
              Signed in: <span className="font-semibold">{user.name}</span>
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
              aria-disabled={logoutMutation.isPending}
              className={cn(
                'rounded-full px-3 py-2 transition-colors',
                logoutMutation.isPending
                  ? 'pointer-events-none text-slate-400'
                  : 'text-slate-700 hover:bg-white/45 hover:text-slate-950',
              )}
              onClick={async (event) => {
                event.preventDefault();
                await handleLogout();
              }}
              to="/login"
            >
              {logoutMutation.isPending ? 'Logging out...' : 'Log out'}
            </Link>
          </nav>
        </header>
        {error ? <p className="text-[0.95rem] text-red-700">{error}</p> : null}
        <Outlet context={{ user }} />
      </div>
    </main>
  );
}

export function useAccountUser() {
  return useOutletContext<AccountOutletContext>().user;
}
