import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { AccountFooter } from '../../components/account/account-footer';
import { AccountHeader } from '../../components/account/account-header';
import { useCurrentUserQuery, useLogoutMutation } from '../../hooks/use-auth';
import { getRedirectSearch } from '../../utils/auth-redirect';

function AccountLoading() {
  return (
    <section className="w-full max-w-120 rounded-3xl border border-slate-900/12 bg-[#fffcf6]/92 p-8 shadow-[0_1.5rem_4rem_rgba(71,46,21,0.14)] backdrop-blur-md sm:p-6">
      <p>Loading your account...</p>
    </section>
  );
}

function AccountErrorMessage({ error }: { error: string }) {
  if (!error) {
    return null;
  }

  return <p className="text-[0.95rem] text-red-700">{error}</p>;
}

export function AccountLayout() {
  const location = useLocation();
  const { isLoading, user } = useCurrentUserQuery();
  const { error, isPending, submit } = useLogoutMutation();

  if (isLoading) return <AccountLoading />;

  if (!user) {
    const search = getRedirectSearch(location.pathname, location.search, location.hash);
    return <Navigate replace to={{ pathname: '/login', search }} />;
  }

  async function handleLogout() {
    await submit();
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(242,201,76,0.45),transparent_32%),linear-gradient(180deg,#f6f1e9_0%,#ece5d9_100%)] p-0 text-slate-900 [scrollbar-gutter:stable] sm:p-12">
      <div className="mx-auto grid w-full max-w-448 gap-6">
        <AccountHeader isLoggingOut={isPending} onLogout={handleLogout} userName={user.name} />
        <AccountErrorMessage error={error} />
        <Outlet context={{ user }} />
        <AccountFooter />
      </div>
    </main>
  );
}
