import { z } from 'zod';

export const createCategorySchema = z.object({
  nameAr: z
    .string({ required_error: 'الاسم بالعربي مطلوب' })
    .transform((val) => val.trim())
    .refine((val) => val.length > 0, { message: 'الاسم بالعربي مطلوب' })
    .refine((val) => val.length <= 100, { message: 'الاسم بالعربي يجب ألا يتجاوز 100 حرف' }),
  nameEn: z
    .string({ required_error: 'English name is required' })
    .transform((val) => val.trim())
    .refine((val) => val.length > 0, { message: 'English name is required' })
    .refine((val) => val.length <= 100, { message: 'English name must not exceed 100 characters' }),
});

export const updateCategorySchema = createCategorySchema;

export const queryCategorySchema = z.object({
  search: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

export const categoryParamSchema = z.object({
  id: z.string().min(1, { message: 'معرف التصنيف مطلوب' }),
});