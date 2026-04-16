import type {
  AuthResponseDto,
  AuthUserDto,
  LoginDto,
  LogoutResponseDto,
  MeResponseDto,
  SignupDto,
} from '@courtlane/contracts';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000/api';

export type {
  AuthResponseDto as AuthResponse,
  AuthUserDto as AuthUser,
  LoginDto as LoginInput,
  MeResponseDto as MeResponse,
  SignupDto as SignupInput,
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

export function signup(input: SignupDto): Promise<AuthResponseDto> {
  return request<AuthResponseDto>('/auth/signup', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export function login(input: LoginDto): Promise<AuthResponseDto> {
  return request<AuthResponseDto>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export function logout(): Promise<LogoutResponseDto> {
  return request<LogoutResponseDto>('/auth/logout', {
    method: 'POST',
  });
}

export function me(): Promise<MeResponseDto> {
  return request<MeResponseDto>('/auth/me');
}
