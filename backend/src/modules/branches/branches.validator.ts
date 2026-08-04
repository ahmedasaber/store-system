import { z } from 'zod';

export const createBranchSchema = z.object({
  name: z.string().min(1),
  code: z.string().min(1),
});
