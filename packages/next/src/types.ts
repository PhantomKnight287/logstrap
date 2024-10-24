import { z } from 'zod';

export const configSchema = z.object({
  name: z.string(),
});
