import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';
import type { AuthResponse, MeResponse } from '../api/auth';
import { getSafeRedirectPath } from '../utils/auth-redirect';

type AuthMutationOptions<TInput> = {
  mutationFn: (input: TInput) => Promise<AuthResponse>;
  submitErrorMessage: string;
};

export function useAuthMutation<TInput>({
  mutationFn,
  submitErrorMessage,
}: AuthMutationOptions<TInput>) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const [error, setError] = useState('');
  const redirectPath = getSafeRedirectPath(searchParams.get('redirect'));

  const mutation = useMutation({
    mutationFn,
    onSuccess: async (response) => {
      queryClient.setQueryData<MeResponse>(['auth', 'me'], {
        user: response.user,
      });
      await navigate(redirectPath, { replace: true });
    },
    onError: (submissionError) => {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : submitErrorMessage,
      );
    },
  });

  function clearError() {
    setError('');
  }

  return {
    clearError,
    error,
    isPending: mutation.isPending,
    submit: async (input: TInput) => {
      try {
        await mutation.mutateAsync(input);
      } catch {
        // Keep the rejection local: onError already updates the UI state.
      }
    },
  };
}
