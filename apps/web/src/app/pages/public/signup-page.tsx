import { type SubmitEventHandler, useState } from 'react';
import { signup } from '../../api/auth';
import { Form } from '../../components/ui/form';
import { Field } from '../../components/ui/field';
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
      alt={{ action: 'Log in', label: 'Already have an account?', path: '/login' }}
      description="Start with email and password. Court reservations come next."
      title="Create your account"
    >
      <Form
        error={error}
        isSubmitting={isPending}
        onSubmit={handleSubmit}
        submitLabel="Create account"
        submittingLabel="Creating account..."
      >
        <Field
          autoComplete="name"
          id="name"
          onChange={(event) => setName(event.target.value)}
          label="Name"
          value={name}
        />
        <Field
          autoComplete="email"
          id="email"
          onChange={(event) => setEmail(event.target.value)}
          label="Email"
          type="email"
          value={email}
        />
        <Field
          autoComplete="new-password"
          id="password"
          minLength={8}
          onChange={(event) => setPassword(event.target.value)}
          label="Password"
          type="password"
          value={password}
        />
      </Form>
    </AuthPage>
  );
}
