import { z } from 'zod';

export const createCustomerSchema = z.object({
  name: z.string().min(1),
  phone: z.string().optional(),
});
