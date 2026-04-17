import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  NavLink,
  Outlet,
  useNavigate,
  useOutletContext,
} from 'react-router-dom';
import { Button } from '../components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import { logout } from '../api/auth';
import { cn } from '@/lib/utils';
import type { AuthUser } from '../api/auth';
import { useAuthenticatedUser } from '../components/protected-layout';

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
      <div className="mx-auto grid w-full max-w-[112rem] gap-4 lg:grid-cols-[14rem_minmax(0,1fr)]">
        <Card className="border border-slate-900/10 bg-[#fffaf1]/92 py-0 shadow-[0_1.5rem_4rem_rgba(71,46,21,0.14)] backdrop-blur-[12px]">
          <CardHeader className="gap-3 border-b border-slate-900/10 px-6 py-6">
            <p className="text-[0.8rem] font-bold uppercase tracking-[0.18em] text-amber-800">
              Account
            </p>
            <div>
              <CardTitle className="text-[clamp(1.75rem,4vw,2.4rem)] leading-[0.96] text-slate-900">
                {user.name}
              </CardTitle>
              <CardDescription className="mt-2 text-slate-900/65">
                Signed in as {user.email}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="grid gap-6 px-6 py-6">
            <dl className="grid gap-4">
              <div className="border-t border-slate-900/10 pt-4 first:border-t-0 first:pt-0">
                <dt className="text-[0.8rem] font-bold uppercase tracking-[0.08em] text-slate-900/55">
                  User ID
                </dt>
                <dd className="mt-1 break-all text-sm text-slate-900/82">
                  {user.id}
                </dd>
              </div>
              <div className="border-t border-slate-900/10 pt-4">
                <dt className="text-[0.8rem] font-bold uppercase tracking-[0.08em] text-slate-900/55">
                  Email
                </dt>
                <dd className="mt-1 text-sm text-slate-900/82">{user.email}</dd>
              </div>
            </dl>
            <nav className="grid gap-2">
              <NavLink
                className={({ isActive }) =>
                  cn(
                    'rounded-3xl border px-4 py-3 text-sm font-medium transition-colors',
                    isActive
                      ? 'border-slate-900 bg-slate-900 text-[#fff8ea]'
                      : 'border-slate-900/10 bg-white/50 text-slate-900 hover:bg-white/85',
                  )
                }
                to="/account/dashboard-page"
              >
                Dashboard
              </NavLink>
            </nav>
            <div className="grid gap-3">
              <Button
                className="w-full rounded-full bg-slate-900 text-[#fff8ea]"
                disabled={logoutMutation.isPending}
                onClick={handleLogout}
                type="button"
              >
                {logoutMutation.isPending ? 'Logging out...' : 'Log out'}
              </Button>
              {error ? (
                <p className="text-[0.95rem] text-red-700">{error}</p>
              ) : null}
            </div>
          </CardContent>
        </Card>
        <Outlet context={{ user }} />
      </div>
    </main>
  );
}

export function useAccountUser() {
  return useOutletContext<AccountOutletContext>().user;
}
