import type { ChangeEventHandler } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type AuthFieldProps = {
  autoComplete?: string;
  id: string;
  label: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  type?: 'email' | 'password' | 'text';
  value: string;
  minLength?: number;
};

export function Field({ autoComplete, id, label, minLength, onChange, type = 'text', value }: AuthFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        autoComplete={autoComplete}
        aria-label={label}
        id={id}
        minLength={minLength}
        name={id}
        onChange={onChange}
        required
        type={type}
        value={value}
      />
    </div>
  );
}
