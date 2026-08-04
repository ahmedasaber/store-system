import { z } from 'zod';

export const createSaleSchema = z.object({
  branchId: z.string().uuid(),
  items: z.array(
    z.object({
      productSizeId: z.string().uuid(),
      quantity: z.number().positive(),
      unitPrice: z.number().nonnegative(),
    }),
  ),
});
