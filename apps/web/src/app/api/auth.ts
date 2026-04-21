import type {
  AuthResponseDto,
  AuthUserDto,
  LoginDto,
  LogoutResponseDto,
  MeResponseDto,
  SignupDto,
} from '@courtlane/contracts';
import { request } from './client';

export type {
  AuthResponseDto as AuthResponse,
  AuthUserDto as AuthUser,
  LoginDto as LoginInput,
  MeResponseDto as MeResponse,
  SignupDto as SignupInput,
};

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
