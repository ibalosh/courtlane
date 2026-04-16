import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signup } from '../api/auth';
import { AuthLayout } from '../components/auth-layout';

export function SignupPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await signup({ email, name, password });
      navigate('/account');
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : 'Signup failed.',
      );
    } finally {
      setIsSubmitting(false);
    }
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
        <label className="grid gap-2">
          <span className="text-[0.95rem] font-bold">Name</span>
          <input
            autoComplete="name"
            className="rounded-2xl border border-slate-900/16 bg-[#fffdf8] px-4 py-3"
            name="name"
            onChange={(event) => setName(event.target.value)}
            required
            value={name}
          />
        </label>

        <label className="grid gap-2">
          <span className="text-[0.95rem] font-bold">Email</span>
          <input
            autoComplete="email"
            className="rounded-2xl border border-slate-900/16 bg-[#fffdf8] px-4 py-3"
            name="email"
            onChange={(event) => setEmail(event.target.value)}
            required
            type="email"
            value={email}
          />
        </label>

        <label className="grid gap-2">
          <span className="text-[0.95rem] font-bold">Password</span>
          <input
            autoComplete="new-password"
            className="rounded-2xl border border-slate-900/16 bg-[#fffdf8] px-4 py-3"
            minLength={8}
            name="password"
            onChange={(event) => setPassword(event.target.value)}
            required
            type="password"
            value={password}
          />
        </label>

        {error ? (
          <p className="m-0 text-[0.95rem] text-red-700">{error}</p>
        ) : null}

        <button
          className="rounded-full bg-slate-900 px-5 py-4 text-[#fff8ea] disabled:cursor-default disabled:opacity-70"
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting ? 'Creating account...' : 'Create account'}
        </button>
      </form>
    </AuthLayout>
  );
}
