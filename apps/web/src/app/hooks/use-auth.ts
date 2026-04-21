import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { logout, me, type AuthResponse, type MeResponse } from '../api/auth';
import { getSafeRedirectPath } from '../utils/auth-redirect';

export const authMeQueryKey = ['auth', 'me'] as const;

type AuthMutationOptions<TInput> = {
  mutationFn: (input: TInput) => Promise<AuthResponse>;
  submitErrorMessage: string;
};

export function useCurrentUserQuery() {
  const query = useQuery({
    queryKey: authMeQueryKey,
    queryFn: me,
  });

  return {
    isLoading: query.isLoading,
    user: query.data?.user ?? null,
  };
}

export function useLogoutMutation() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: logout,
    onSuccess: async () => {
      queryClient.setQueryData<MeResponse>(authMeQueryKey, { user: null });
      await navigate('/login');
    },
  });

  async function submit() {
    mutation.reset();

    try {
      await mutation.mutateAsync();
    } catch {
      // Expose request failures through the mutation state for the layout.
    }
  }

  return {
    error: mutation.error instanceof Error ? mutation.error.message : mutation.error ? 'Logout failed.' : '',
    isPending: mutation.isPending,
    submit,
  };
}

export function useAuthMutation<TInput>({ mutationFn, submitErrorMessage }: AuthMutationOptions<TInput>) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const redirectPath = getSafeRedirectPath(searchParams.get('redirect'));

  const mutation = useMutation({
    mutationFn,
    onSuccess: async (response) => {
      queryClient.setQueryData<MeResponse>(authMeQueryKey, {
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
