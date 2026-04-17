import type { AuthUserDto } from '@courtlane/contracts';
import type { Request } from 'express';

export type AuthenticatedRequest = Request & {
  user?: AuthUserDto | null;
};
