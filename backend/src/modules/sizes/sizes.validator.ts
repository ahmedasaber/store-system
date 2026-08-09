import { z } from 'zod';

export const createSizeSchema = z.object({
  name: z
    .string({ required_error: 'اسم المقاس مطلوب' })
    .transform((val) => val.trim())
    .refine((val) => val.length > 0, { message: 'اسم المقاس مطلوب' })
    .refine((val) => val.length <= 50, { message: 'اسم المقاس يجب ألا يتجاوز 50 حرف' }),
  sortOrder: z.coerce
    .number({ required_error: 'ترتيب العرض مطلوب' })
    .int({ message: 'الترتيب يجب أن يكون عدداً صحيحاً' })
    .min(0, { message: 'الترتيب يجب ألا يكون سالباً' }),
});

export const updateSizeSchema = createSizeSchema;

export const querySizeSchema = z.object({
  search: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

export const sizeParamSchema = z.object({
  id: z.string().min(1, { message: 'معرف المقاس مطلوب' }),
});
