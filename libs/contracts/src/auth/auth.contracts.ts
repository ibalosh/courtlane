import { z } from 'zod';

export const signupRequestSchema = z.object({
  email: z.email().trim().toLowerCase().min(1).max(255),
  name: z.string().trim().min(1).max(100),
  password: z.string().min(8).max(128),
});

export const loginRequestSchema = z.object({
  email: z.email().trim().toLowerCase().min(1).max(255),
  password: z.string().min(1).max(128),
});

export const updateProfileRequestSchema = z
  .object({
    email: z.email().trim().toLowerCase().min(1).max(255),
    name: z.string().trim().min(1).max(100),
    currentPassword: z.string().min(1).max(128).optional(),
    newPassword: z.string().min(8).max(128).optional(),
  })
  .refine(
    (input) =>
      (!input.currentPassword && !input.newPassword) || (Boolean(input.currentPassword) && Boolean(input.newPassword)),
    {
      message: 'Current password and new password must both be provided.',
      path: ['newPassword'],
    },
  );

export const authUserSchema = z.object({
  id: z.number().int().positive(),
  accountId: z.number().int().positive(),
  email: z.email().trim().min(1).max(255),
  name: z.string(),
});

export const authResponseSchema = z.object({
  user: authUserSchema,
});

export const logoutResponseSchema = z.object({
  ok: z.literal(true),
});

export const meResponseSchema = z.object({
  user: authUserSchema.nullable(),
});

export type SignupDto = z.infer<typeof signupRequestSchema>;
export type LoginDto = z.infer<typeof loginRequestSchema>;
export type UpdateProfileDto = z.infer<typeof updateProfileRequestSchema>;
export type AuthUserDto = z.infer<typeof authUserSchema>;
export type AuthResponseDto = z.infer<typeof authResponseSchema>;
export type LogoutResponseDto = z.infer<typeof logoutResponseSchema>;
export type MeResponseDto = z.infer<typeof meResponseSchema>;
