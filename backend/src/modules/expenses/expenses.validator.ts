import { z } from 'zod';

export const createExpenseSchema = z.object({
  branchId: z.string().uuid(),
  categoryId: z.string().uuid(),
  amount: z.number().positive(),
});
