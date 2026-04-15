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

export const authUserSchema = z.object({
  id: z.string(),
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

export type SignupRequest = z.infer<typeof signupRequestSchema>;
export type LoginRequest = z.infer<typeof loginRequestSchema>;
export type AuthUser = z.infer<typeof authUserSchema>;
export type AuthResponse = z.infer<typeof authResponseSchema>;
export type LogoutResponse = z.infer<typeof logoutResponseSchema>;
export type MeResponse = z.infer<typeof meResponseSchema>;
