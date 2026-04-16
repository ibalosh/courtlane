import { CookieOptions } from 'express';

export function getSessionCookieOptions(
  overrides: Partial<CookieOptions> = {},
): CookieOptions {
  return {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env['NODE_ENV'] === 'production',
    path: '/',
    ...overrides,
  };
}
