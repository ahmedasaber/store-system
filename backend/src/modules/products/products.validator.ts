import { z } from 'zod';

export const createProductSchema = z.object({
  name: z.string().min(1),
  code: z.string().min(1),
  categoryId: z.string().uuid(),
});
