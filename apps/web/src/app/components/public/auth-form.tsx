import type { ComponentProps, ReactNode } from 'react';
import { Button } from '@/components/ui/button';

type AuthFormProps = {
  children: ReactNode;
  error: string;
  isSubmitting: boolean;
  onSubmit: NonNullable<ComponentProps<'form'>['onSubmit']>;
  submitLabel: string;
  submittingLabel: string;
};

export function AuthForm({ children, error, isSubmitting, onSubmit, submitLabel, submittingLabel }: AuthFormProps) {
  return (
    <form className="flex flex-col gap-4" onSubmit={onSubmit}>
      <div className="flex flex-col gap-2">{children}</div>

      {error ? <p className="text-destructive text-sm">{error}</p> : null}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? submittingLabel : submitLabel}
      </Button>
    </form>
  );
}
