import type { HttpErrorResponseDto } from '@courtlane/contracts';

const API_BASE_URL = import.meta.env.API_BASE_URL ?? 'http://localhost:3000/api';

export async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
    ...init,
  });

  if (!response.ok) {
    const error = (await response.json().catch(() => null)) as HttpErrorResponseDto | null;

    throw new Error(error?.message ?? 'Request failed.');
  }

  return (await response.json()) as Promise<T>;
}
