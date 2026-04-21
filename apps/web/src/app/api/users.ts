import type { AuthResponseDto, UpdateProfileDto } from '@courtlane/contracts';
import { request } from './client';

export type { UpdateProfileDto as UpdateProfileInput };

export function updateProfile(input: UpdateProfileDto): Promise<AuthResponseDto> {
  return request<AuthResponseDto>('/users/me', {
    method: 'PATCH',
    body: JSON.stringify(input),
  });
}
