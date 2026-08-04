import { z } from 'zod';

export const adjustStockSchema = z.object({
  productSizeId: z.string().uuid(),
  quantityChange: z.number(),
});
