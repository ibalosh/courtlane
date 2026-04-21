import { z } from 'zod';

export const updateProfileRequestSchema = z
  .object({
    email: z.email().trim().toLowerCase().min(1).max(255),
    name: z.string().trim().min(1).max(100),
    currentPassword: z.string().min(1).max(128).optional(),
    newPassword: z.string().min(8).max(128).optional(),
  })
  .refine(
    (input) => {
      // Password changes are optional, but if either password field is sent,
      // the request must include both the current and new password.
      const isChangingPassword = Boolean(input.currentPassword || input.newPassword);
      const hasBothPasswords = Boolean(input.currentPassword && input.newPassword);

      return !isChangingPassword || hasBothPasswords;
    },
    {
      message: 'Current password and new password must both be provided.',
      path: ['newPassword'],
    },
  );

export type UpdateProfileDto = z.infer<typeof updateProfileRequestSchema>;
