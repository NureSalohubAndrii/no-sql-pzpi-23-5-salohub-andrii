import { z } from 'zod';

export const verifyEmailSchema = z.object({
  code: z
    .string()
    .length(4, 'Code must be 4 digits')
    .regex(/^\d{4}$/, 'Code must contain digits only'),
});

export type VerifyEmailFormData = z.infer<typeof verifyEmailSchema>;
