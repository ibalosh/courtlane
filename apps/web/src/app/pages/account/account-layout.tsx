import { useQuery } from '@tanstack/react-query';
import { Navigate, Outlet, useLocation, useOutletContext } from 'react-router-dom';
import { me, type AuthUser } from '../../api/auth';
import { getRedirectSearch } from '../../utils/auth-redirect';

type AuthenticatedOutletContext = {
  user: AuthUser;
};

export function useAuthenticatedUser() {
  return useOutletContext<AuthenticatedOutletContext>().user;
}

function AccountLoading() {
  return (
    <section className="w-full max-w-[30rem] rounded-3xl border border-slate-900/12 bg-[#fffcf6]/92 p-8 shadow-[0_1.5rem_4rem_rgba(71,46,21,0.14)] backdrop-blur-[12px] sm:p-6">
      <p>Loading your account...</p>
    </section>
  );
}

export function AccountLayout() {
  const location = useLocation();
  const meQuery = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: me,
  });

  if (meQuery.isLoading) return <AccountLoading />;

  const user = meQuery.data?.user ?? null;

  if (!user) {
    return (
      <Navigate
        replace
        to={{
          pathname: '/login',
          search: getRedirectSearch(location.pathname, location.search, location.hash),
        }}
      />
    );
  }

  return (
    <main className="grid min-h-screen place-items-center bg-[radial-gradient(circle_at_top,_rgba(242,201,76,0.45),_transparent_32%),linear-gradient(180deg,_#f6f1e9_0%,_#ece5d9_100%)] px-4 py-8 text-slate-900">
      <Outlet context={{ user }} />;
    </main>
  );
}
