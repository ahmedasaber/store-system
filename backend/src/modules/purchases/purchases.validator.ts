import { z } from 'zod';

export const createPurchaseSchema = z.object({
  branchId: z.string().uuid(),
  supplierId: z.string().uuid().optional(),
});
