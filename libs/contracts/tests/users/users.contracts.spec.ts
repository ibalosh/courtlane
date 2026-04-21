import { updateProfileRequestSchema } from '../../src/users.contracts';

describe('users contracts', () => {
  it('allows profile updates without a password change', () => {
    expect(
      updateProfileRequestSchema.parse({
        email: 'USER@example.com',
        name: ' User Name ',
      }),
    ).toEqual({
      email: 'user@example.com',
      name: 'User Name',
    });
  });

  it('requires both current and new password together', () => {
    expect(() =>
      updateProfileRequestSchema.parse({
        email: 'user@example.com',
        name: 'User Name',
        currentPassword: 'password123',
      }),
    ).toThrow('Current password and new password must both be provided.');
  });
});
