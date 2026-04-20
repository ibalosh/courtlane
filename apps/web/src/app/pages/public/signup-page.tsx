import { type SubmitEventHandler, useState } from 'react';
import { signup } from '../../api/auth';
import { AuthForm } from '../../components/public/auth-form';
import { AuthField } from '../../components/public/auth-field';
import { useAuthMutation } from '../../hooks/use-auth';
import { AuthPage } from './auth-page';

export function SignupPage() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  const { error, isPending, submit } = useAuthMutation({
    mutationFn: signup,
    submitErrorMessage: 'Signup failed.',
  });

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    await submit({ email, name, password });
  };

  return (
    <AuthPage
      altAction="Log in"
      altLabel="Already have an account?"
      altPath="/login"
      description="Start with email and password. Court reservations come next."
      title="Create your account"
    >
      <AuthForm
        error={error}
        isSubmitting={isPending}
        onSubmit={handleSubmit}
        submitLabel="Create account"
        submittingLabel="Creating account..."
      >
        <AuthField
          autoComplete="name"
          id="name"
          onChange={(event) => setName(event.target.value)}
          label="Name"
          value={name}
        />
        <AuthField
          autoComplete="email"
          id="email"
          onChange={(event) => setEmail(event.target.value)}
          label="Email"
          type="email"
          value={email}
        />
        <AuthField
          autoComplete="new-password"
          id="password"
          minLength={8}
          onChange={(event) => setPassword(event.target.value)}
          label="Password"
          type="password"
          value={password}
        />
      </AuthForm>
    </AuthPage>
  );
}
