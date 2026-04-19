import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Outlet, useNavigate } from 'react-router-dom';
import { logout } from '../../api/auth';
import { AccountFooter } from '../../components/account/account-footer';
import { AccountHeader } from '../../components/account/account-header';
import { useAuthenticatedUser } from './account-layout';

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
        <AccountHeader
          isLoggingOut={logoutMutation.isPending}
          onLogout={handleLogout}
          userName={user.name}
        />
        {error ? <p className="text-[0.95rem] text-red-700">{error}</p> : null}
        <Outlet context={{ user }} />
        <AccountFooter />
      </div>
    </main>
  );
}
