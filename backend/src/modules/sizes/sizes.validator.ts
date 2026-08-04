import { z } from 'zod';

export const createSizeSchema = z.object({
  name: z.string().min(1),
  sortOrder: z.number().default(0),
});
