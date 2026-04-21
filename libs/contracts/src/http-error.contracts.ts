import { z } from 'zod';

export const httpErrorResponseSchema = z.object({
  message: z.string(),
  error: z.string(),
  statusCode: z.number().int(),
});

export type HttpErrorResponseDto = z.infer<typeof httpErrorResponseSchema>;
