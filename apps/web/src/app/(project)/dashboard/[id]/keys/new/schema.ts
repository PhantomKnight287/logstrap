import { z } from 'zod';

export const createNewApiKeySchema = z.object({
  name: z
    .string({ description: 'Please name this API Key' })
    .min(1, { message: 'Please name this API key' }),
  description: z.string({ message: 'Please describe this API Key' }).optional(),
  mode: z.enum(['test', 'live'], { message: 'Please select a project mode.' }),
});
