import { SubmitEvent, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateProfile } from '../../api/auth';
import { authMeQueryKey, useCurrentUserQuery } from '../../hooks/use-auth';
import { Field } from '../../components/public/auth/field';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function ProfilePage() {
  const queryClient = useQueryClient();
  const { user } = useCurrentUserQuery();
  const [name, setName] = useState(user?.name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const mutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: async (response) => {
      queryClient.setQueryData(authMeQueryKey, { user: response.user });
      setCurrentPassword('');
      setNewPassword('');
    },
  });

  if (!user) {
    return null;
  }

  async function handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    mutation.reset();

    await mutation.mutateAsync({
      email,
      name,
      ...(currentPassword || newPassword ? { currentPassword, newPassword } : {}),
    });
  }

  const error =
    mutation.error instanceof Error ? mutation.error.message : mutation.error ? 'Profile update failed.' : '';
  const successMessage = mutation.isSuccess ? 'Profile updated.' : '';

  return (
    <Card className="w-full border-border/70 bg-background/90 shadow-[0_16px_40px_rgba(15,23,42,0.08)]">
      <CardHeader className="m-5 gap-3 border-b">
        <p className="text-muted-foreground text-xs font-semibold uppercase tracking-[0.16em]">Profile</p>
        <div className="max-w-2xl">
          <CardTitle className="text-[clamp(2rem,5vw,3.25rem)] leading-[0.94]">Account Settings</CardTitle>
          <CardDescription className="mt-2 leading-6">
            Update your name and email, or set a new password after confirming the current one.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="py-6">
        <form className="grid gap-6 md:max-w-xl" onSubmit={(event) => void handleSubmit(event)}>
          <Field id="profile-name" label="Name" onChange={(event) => setName(event.target.value)} value={name} />
          <Field
            id="profile-email"
            label="Email"
            onChange={(event) => setEmail(event.target.value)}
            type="email"
            value={email}
          />
          <Field
            autoComplete="current-password"
            id="profile-current-password"
            label="Current password"
            onChange={(event) => setCurrentPassword(event.target.value)}
            type="password"
            value={currentPassword}
          />
          <Field
            autoComplete="new-password"
            id="profile-new-password"
            label="New password"
            minLength={8}
            onChange={(event) => setNewPassword(event.target.value)}
            type="password"
            value={newPassword}
          />
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
          {successMessage ? <p className="text-sm text-emerald-700">{successMessage}</p> : null}
          <div className="flex flex-wrap gap-2">
            <Button disabled={mutation.isPending} type="submit">
              {mutation.isPending ? 'Saving...' : 'Save changes'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
