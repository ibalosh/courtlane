import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { logout, me } from '../api/auth';

export function AccountPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [error, setError] = useState('');
  const meQuery = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: me,
  });
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

  if (meQuery.isLoading) {
    return (
      <main className="grid min-h-screen place-items-center bg-[radial-gradient(circle_at_top,_rgba(242,201,76,0.45),_transparent_32%),linear-gradient(180deg,_#f6f1e9_0%,_#ece5d9_100%)] px-4 py-8 text-slate-900">
        <section className="w-full max-w-[30rem] rounded-3xl border border-slate-900/12 bg-[#fffcf6]/92 p-8 shadow-[0_1.5rem_4rem_rgba(71,46,21,0.14)] backdrop-blur-[12px] sm:p-6">
          <p>Loading your account...</p>
        </section>
      </main>
    );
  }

  const user = meQuery.data?.user ?? null;
  const queryError =
    meQuery.error instanceof Error
      ? meQuery.error.message
      : 'Could not load user.';

  if (!user) {
    return (
      <main className="grid min-h-screen place-items-center bg-[radial-gradient(circle_at_top,_rgba(242,201,76,0.45),_transparent_32%),linear-gradient(180deg,_#f6f1e9_0%,_#ece5d9_100%)] px-4 py-8 text-slate-900">
        <section className="w-full max-w-[30rem] rounded-3xl border border-slate-900/12 bg-[#fffcf6]/92 p-8 shadow-[0_1.5rem_4rem_rgba(71,46,21,0.14)] backdrop-blur-[12px] sm:p-6">
          <h1 className="text-[clamp(2rem,5vw,3rem)] leading-[0.98] font-semibold">
            You are not logged in
          </h1>
          <p className="mt-4 text-slate-900/70">
            Use one of the auth routes to create a session first.
          </p>
          <div className="mt-4 flex gap-4">
            <Link to="/signup">Sign up</Link>
            <Link to="/login">Log in</Link>
          </div>
          {meQuery.isError ? (
            <p className="mt-4 text-[0.95rem] text-red-700">{queryError}</p>
          ) : null}
        </section>
      </main>
    );
  }

  return (
    <main className="grid min-h-screen place-items-center bg-[radial-gradient(circle_at_top,_rgba(242,201,76,0.45),_transparent_32%),linear-gradient(180deg,_#f6f1e9_0%,_#ece5d9_100%)] px-4 py-8 text-slate-900">
      <section className="w-full max-w-[30rem] rounded-3xl border border-slate-900/12 bg-[#fffcf6]/92 p-8 shadow-[0_1.5rem_4rem_rgba(71,46,21,0.14)] backdrop-blur-[12px] sm:p-6">
        <p className="mb-2 text-[0.85rem] font-bold uppercase tracking-[0.16em] text-amber-800">
          Account
        </p>
        <h1 className="text-[clamp(2rem,5vw,3rem)] leading-[0.98] font-semibold">
          {user.name}
        </h1>
        <p className="mt-4 text-slate-900/70">Signed in as {user.email}</p>
        <dl className="mt-6 grid gap-4">
          <div className="border-t border-slate-900/10 pt-4">
            <dt className="text-[0.85rem] font-bold uppercase tracking-[0.06em] text-slate-900/60">
              User ID
            </dt>
            <dd className="mt-1">{user.id}</dd>
          </div>
          <div className="border-t border-slate-900/10 pt-4">
            <dt className="text-[0.85rem] font-bold uppercase tracking-[0.06em] text-slate-900/60">
              Email
            </dt>
            <dd className="mt-1">{user.email}</dd>
          </div>
        </dl>
        <button
          className="rounded-full bg-slate-900 px-5 py-4 text-[#fff8ea] disabled:cursor-default disabled:opacity-70"
          disabled={logoutMutation.isPending}
          onClick={handleLogout}
          type="button"
        >
          {logoutMutation.isPending ? 'Logging out...' : 'Log out'}
        </button>
        {error ? (
          <p className="mt-4 text-[0.95rem] text-red-700">{error}</p>
        ) : null}
      </section>
    </main>
  );
}
