const API_BASE_URL =
  import.meta.env.API_BASE_URL ?? 'http://localhost:3000/api';

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
    const message = await response.text();
    throw new Error(message || 'Request failed.');
  }

  return (await response.json()) as Promise<T>;
}
