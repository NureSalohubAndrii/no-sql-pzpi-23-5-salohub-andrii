import { z } from 'zod';

export const businessRegistrationSchema = z.object({
  establishmentName: z
    .string()
    .min(2, 'Business name must be at least 2 characters')
    .max(100, 'Business name must be less than 100 characters'),
  email: z.email('Please enter a valid email address'),
  address: z
    .string()
    .min(5, 'Please enter a valid address')
    .max(200, 'Address must be less than 200 characters'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password must be less than 100 characters'),
  agreeToTerms: z.boolean().refine(val => val === true, {
    message: 'You must agree to the Terms of Service and Privacy Policy to continue.',
  }),
});

export type BusinessRegistrationFormData = z.infer<typeof businessRegistrationSchema>;
