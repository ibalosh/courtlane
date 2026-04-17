import {
  authUserSchema,
  loginRequestSchema,
  meResponseSchema,
  signupRequestSchema,
} from '../../src/auth/auth.contracts';

describe('auth contracts', () => {
  it('validates and formats signup requests', () => {
    expect(
      signupRequestSchema.parse({
        email: 'USER@example.com',
        name: ' User Name ',
        password: 'password123',
      }),
    ).toEqual({
      email: 'user@example.com',
      name: 'User Name',
      password: 'password123',
    });
  });

  it('rejects short signup passwords', () => {
    expect(() =>
      signupRequestSchema.parse({
        email: 'user@example.com',
        name: 'User Name',
        password: 'short',
      }),
    ).toThrow();
  });

  it('validates login requests', () => {
    expect(
      loginRequestSchema.parse({
        email: 'USER@example.com',
        password: 'password123',
      }),
    ).toEqual({
      email: 'user@example.com',
      password: 'password123',
    });
  });

  it('allows unauthenticated me responses', () => {
    expect(meResponseSchema.parse({ user: null })).toEqual({ user: null });
  });

  it('requires account ownership on authenticated users', () => {
    expect(
      authUserSchema.parse({
        id: 1,
        accountId: 10,
        email: 'user@example.com',
        name: 'User Name',
      }),
    ).toEqual({
      id: 1,
      accountId: 10,
      email: 'user@example.com',
      name: 'User Name',
    });
  });
});
