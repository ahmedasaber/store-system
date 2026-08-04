import { z } from 'zod';

export const reportQuerySchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  branchId: z.string().uuid().optional(),
});
