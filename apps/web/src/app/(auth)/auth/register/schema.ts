import { z } from 'zod';
export const registerSchema = z.object({
  name: z.string().min(1, { message: 'Please tell us your name' }),
  email: z.string().email({ message: 'Please enter a valid email' }),
  password: z
    .string()
    .min(9, { message: 'Password must be of alteast 8 characters' }),
});
