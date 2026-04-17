import { FormEvent, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { login, type MeResponse } from '../api/auth';
import { AuthLayout } from '../components/auth-layout';
import { getAuthPageHref, getSafeRedirectPath } from '../utils/auth-redirect';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const redirectPath = getSafeRedirectPath(searchParams.get('redirect'));

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: async (response) => {
      queryClient.setQueryData<MeResponse>(['auth', 'me'], {
        user: response.user,
      });
      await navigate(redirectPath, { replace: true });
    },
    onError: (submissionError) => {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : 'Login failed.',
      );
    },
  });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    await loginMutation.mutateAsync({ email, password });
  }

  return (
    <AuthLayout
      title="Welcome back"
      description="Log in to manage your bookings and account."
      altLabel="Need an account?"
      altHref={getAuthPageHref('/signup', searchParams.get('redirect'))}
      altAction="Sign up"
    >
      <form className="grid gap-4" onSubmit={handleSubmit}>
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            autoComplete="email"
            aria-label="Email"
            id="email"
            name="email"
            onChange={(event) => setEmail(event.target.value)}
            required
            type="email"
            value={email}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input
            autoComplete="current-password"
            aria-label="Password"
            id="password"
            name="password"
            onChange={(event) => setPassword(event.target.value)}
            required
            type="password"
            value={password}
          />
        </div>

        {error ? <p className="text-destructive text-sm">{error}</p> : null}

        <Button type="submit" disabled={loginMutation.isPending}>
          {loginMutation.isPending ? 'Logging in...' : 'Log in'}
        </Button>
      </form>
    </AuthLayout>
  );
}
