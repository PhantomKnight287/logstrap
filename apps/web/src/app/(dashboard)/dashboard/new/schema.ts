import { z } from 'zod';

export const createNewProjectSchema = z.object({
  name: z.string().min(1, { message: 'Please enter name of your project' }),
  description: z
    .string({ message: 'Please enter description of your project' })
    .optional(),
  url: z.string().url({ message: 'Please enter a valid url' }).optional(),
});
