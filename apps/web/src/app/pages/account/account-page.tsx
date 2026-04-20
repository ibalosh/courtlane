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
  const [logoutError, setLogoutError] = useState('');
  const user = useAuthenticatedUser();
  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: async () => {
      queryClient.setQueryData(['auth', 'me'], { user: null });
      await navigate('/login');
    },
    onError: (logoutError) => {
      setLogoutError(logoutError instanceof Error ? logoutError.message : 'Logout failed.');
    },
  });

  async function handleLogout() {
    setLogoutError('');
    await logoutMutation.mutateAsync();
  }

  return (
    <div className="mx-auto grid w-full max-w-448 gap-6">
      <AccountHeader isLoggingOut={logoutMutation.isPending} onLogout={handleLogout} userName={user.name} />
      {logoutError ? <p className="text-[0.95rem] text-red-700">{logoutError}</p> : null}
      <Outlet context={{ user }} />
      <AccountFooter />
    </div>
  );
}
