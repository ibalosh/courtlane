import { type SubmitEventHandler, useState } from 'react';
import { login } from '../../api/auth';
import { AuthForm } from '../../components/public/auth-form';
import { AuthField } from '../../components/public/auth-field';
import { useAuthMutation } from '../../hooks/use-auth';
import { AuthPage } from './auth-page';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { error, isPending, submit } = useAuthMutation({
    mutationFn: login,
    submitErrorMessage: 'Login failed.',
  });

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    await submit({ email, password });
  };

  return (
    <AuthPage
      altAction="Sign up"
      altLabel="Need an account?"
      altPath="/signup"
      description="Log in to manage your bookings and account."
      title="Welcome back"
    >
      <AuthForm
        error={error}
        isSubmitting={isPending}
        onSubmit={handleSubmit}
        submitLabel="Log in"
        submittingLabel="Logging in..."
      >
        <AuthField
          autoComplete="email"
          id="email"
          label="Email"
          onChange={(event) => setEmail(event.target.value)}
          type="email"
          value={email}
        />
        <AuthField
          autoComplete="current-password"
          id="password"
          label="Password"
          onChange={(event) => setPassword(event.target.value)}
          type="password"
          value={password}
        />
      </AuthForm>
    </AuthPage>
  );
}
