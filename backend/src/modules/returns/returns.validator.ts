import { z } from 'zod';

export const createReturnSchema = z.object({
  saleId: z.string().uuid().optional(),
  branchId: z.string().uuid(),
});
