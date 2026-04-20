import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { AuthUserDto } from '@courtlane/contracts';
import type { AuthenticatedRequest } from './auth.types';

export const CurrentUser = createParamDecorator((_data: unknown, context: ExecutionContext): AuthUserDto | null => {
  const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
  return request.user ?? null;
});
