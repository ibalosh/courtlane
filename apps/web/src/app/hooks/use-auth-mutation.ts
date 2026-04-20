import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';
import type { AuthResponse, MeResponse } from '../api/auth';
import { getSafeRedirectPath } from '../utils/auth-redirect';

type AuthMutationOptions<TInput> = {
  mutationFn: (input: TInput) => Promise<AuthResponse>;
  submitErrorMessage: string;
};

export function useAuthMutation<TInput>({ mutationFn, submitErrorMessage }: AuthMutationOptions<TInput>) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const redirectPath = getSafeRedirectPath(searchParams.get('redirect'));

  const mutation = useMutation({
    mutationFn,
    onSuccess: async (response) => {
      queryClient.setQueryData<MeResponse>(['auth', 'me'], {
        user: response.user,
      });
      await navigate(redirectPath, { replace: true });
    },
  });

  async function submit(input: TInput) {
    mutation.reset();

    try {
      await mutation.mutateAsync(input);
    } catch {
      // Expose request failures through the mutation state for the form.
    }
  }

  return {
    error: mutation.error instanceof Error ? mutation.error.message : mutation.error ? submitErrorMessage : '',
    isPending: mutation.isPending,
    submit,
  };
}
