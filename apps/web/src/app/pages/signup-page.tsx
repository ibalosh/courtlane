import { SubmitEvent, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { signup, type MeResponse } from '../api/auth';
import { AuthLayout } from '../components/auth-layout';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';

export function SignupPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const signupMutation = useMutation({
    mutationFn: signup,
    onSuccess: async (response) => {
      queryClient.setQueryData<MeResponse>(['auth', 'me'], {
        user: response.user,
      });
      await navigate('/account');
    },
    onError: (submissionError) => {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : 'Signup failed.',
      );
    },
  });

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    await signupMutation.mutateAsync({ email, name, password });
  }

  return (
    <AuthLayout
      title="Create your account"
      description="Start with email and password. Court reservations come next."
      altLabel="Already have an account?"
      altHref="/login"
      altAction="Log in"
    >
      <form className="mt-7 grid gap-4" onSubmit={handleSubmit}>
        <div className="grid gap-2">
          <Label htmlFor="name">Name</Label>
          <Input
            autoComplete="name"
            aria-label="Name"
            id="name"
            name="name"
            onChange={(event) => setName(event.target.value)}
            required
            value={name}
          />
        </div>

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
            autoComplete="new-password"
            aria-label="Password"
            id="password"
            minLength={8}
            name="password"
            onChange={(event) => setPassword(event.target.value)}
            required
            type="password"
            value={password}
          />
        </div>

        {error ? (
          <p className="m-0 text-[0.95rem] text-red-700">{error}</p>
        ) : null}

        <Button type="submit" disabled={signupMutation.isPending}>
          {signupMutation.isPending ? 'Creating account...' : 'Create account'}
        </Button>
      </form>
    </AuthLayout>
  );
}
