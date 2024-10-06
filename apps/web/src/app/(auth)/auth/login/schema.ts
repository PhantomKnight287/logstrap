import { z } from 'zod';
export const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email' }),
  password: z
    .string()
    .min(9, { message: 'Password must be of alteast 8 characters' }),
});
