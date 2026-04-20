import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Navigate, Outlet, useLocation, useOutletContext } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { logout, me, type AuthUser } from '../../api/auth';
import { AccountFooter } from '../../components/account/account-footer';
import { AccountHeader } from '../../components/account/account-header';
import { getRedirectSearch } from '../../utils/auth-redirect';

type AuthenticatedOutletContext = {
  user: AuthUser;
};

export function useAuthenticatedUser() {
  return useOutletContext<AuthenticatedOutletContext>().user;
}

function AccountLoading() {
  return (
    <section className="w-full max-w-120 rounded-3xl border border-slate-900/12 bg-[#fffcf6]/92 p-8 shadow-[0_1.5rem_4rem_rgba(71,46,21,0.14)] backdrop-blur-md sm:p-6">
      <p>Loading your account...</p>
    </section>
  );
}

export function AccountLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [logoutError, setLogoutError] = useState('');
  const meQuery = useQuery({ queryKey: ['auth', 'me'], queryFn: me });
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

  if (meQuery.isLoading) return <AccountLoading />;

  const user = meQuery.data?.user ?? null;

  if (!user) {
    const search = getRedirectSearch(location.pathname, location.search, location.hash);
    return <Navigate replace to={{ pathname: '/login', search }} />;
  }

  async function handleLogout() {
    setLogoutError('');
    await logoutMutation.mutateAsync();
  }

  return (
    <main className="grid min-h-screen place-items-center bg-[radial-gradient(circle_at_top,rgba(242,201,76,0.45),transparent_32%),linear-gradient(180deg,#f6f1e9_0%,#ece5d9_100%)] px-4 py-8 text-slate-900">
      <div className="mx-auto grid w-full max-w-448 gap-6">
        <AccountHeader isLoggingOut={logoutMutation.isPending} onLogout={handleLogout} userName={user.name} />
        {logoutError ? <p className="text-[0.95rem] text-red-700">{logoutError}</p> : null}
        <Outlet context={{ user }} />
        <AccountFooter />
      </div>
    </main>
  );
}
