import { z } from 'zod';

export const SignupSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  firstName: z.string().max(100).optional(),
  lastName: z.string().max(100).optional(),
  onboarding: z.record(z.any()).default({}),
});

export const LoginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

export type SignupData = z.infer<typeof SignupSchema>;
export type LoginData = z.infer<typeof LoginSchema>;
