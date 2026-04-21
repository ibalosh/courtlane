import { type SubmitEventHandler, useState } from 'react';
import { login } from '../../api/auth';
import { Form } from '../../components/ui/form';
import { Field } from '../../components/ui/field';
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
      alt={{ action: 'Sign up', label: 'Need an account?', path: '/signup' }}
      description="Log in to manage your bookings and account."
      title="Welcome back"
    >
      <Form
        error={error}
        isSubmitting={isPending}
        onSubmit={handleSubmit}
        submitLabel="Log in"
        submittingLabel="Logging in..."
      >
        <Field
          autoComplete="email"
          id="email"
          label="Email"
          onChange={(event) => setEmail(event.target.value)}
          type="email"
          value={email}
        />
        <Field
          autoComplete="current-password"
          id="password"
          label="Password"
          onChange={(event) => setPassword(event.target.value)}
          type="password"
          value={password}
        />
      </Form>
    </AuthPage>
  );
}
