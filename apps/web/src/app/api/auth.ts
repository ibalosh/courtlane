const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000/api';

export type AuthUser = {
  id: string;
  email: string;
  name: string;
};

export type AuthResponse = {
  user: AuthUser;
};

export type MeResponse = {
  user: AuthUser | null;
};

export type SignupInput = {
  email: string;
  name: string;
  password: string;
};

export type LoginInput = {
  email: string;
  password: string;
};

async function request<T>(path: string, init?: RequestInit): Promise<T> {
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

export function signup(input: SignupInput): Promise<AuthResponse> {
  return request<AuthResponse>('/auth/signup', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export function login(input: LoginInput): Promise<AuthResponse> {
  return request<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export function logout(): Promise<{ ok: true }> {
  return request<{ ok: true }>('/auth/logout', {
    method: 'POST',
  });
}

export function me(): Promise<MeResponse> {
  return request<MeResponse>('/auth/me');
}
