import { prisma } from '../../shared/database/prisma.js';
import { AppError } from '../../shared/utils/appError.js';
import {
  CategoryResponse,
  CreateCategoryInput,
  QueryCategoriesInput,
  UpdateCategoryInput,
} from './categories.types.js';

export class CategoriesService {
  private formatCategory(category: any): CategoryResponse {
    return {
      id: category.id,
      nameAr: category.nameAr,
      nameEn: category.nameEn,
      isActive: category.isActive,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
      deletedAt: category.deletedAt,
    };
  }

  async listCategories(query: QueryCategoriesInput) {
    const page = query.page && query.page > 0 ? Number(query.page) : 1;
    const limit = query.limit && query.limit > 0 ? Number(query.limit) : 10;
    const skip = (page - 1) * limit;

    const whereClause: any = {
      deletedAt: null,
    };

    if (query.search && query.search.trim() !== '') {
      const searchTerm = query.search.trim();
      whereClause.OR = [
        { nameAr: { contains: searchTerm, mode: 'insensitive' } },
        { nameEn: { contains: searchTerm, mode: 'insensitive' } },
      ];
    }

    const [total, records] = await Promise.all([
      prisma.category.count({ where: whereClause }),
      prisma.category.findMany({
        where: whereClause,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
    ]);

    const totalPages = Math.ceil(total / limit) || 1;

    return {
      data: records.map(this.formatCategory),
      meta: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  }

  async getCategoryById(id: string): Promise<CategoryResponse> {
    const category = await prisma.category.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });

    if (!category) {
      throw new AppError('التصنيف غير موجود', 404);
    }

    return this.formatCategory(category);
  }

  async createCategory(input: CreateCategoryInput): Promise<CategoryResponse> {
    const nameAr = input.nameAr.trim();
    const nameEn = input.nameEn.trim();

    if (!nameAr || !nameEn) {
      throw new AppError('الاسم بالعربي والاسم بالإنجليزي مطلوبان', 400);
    }

    // Check duplicate nameAr among active categories
    const existingAr = await prisma.category.findFirst({
      where: {
        nameAr: { equals: nameAr, mode: 'insensitive' },
        deletedAt: null,
      },
    });

    if (existingAr) {
      throw new AppError('يوجد تصنيف آخر بنفس الاسم العربي', 400);
    }

    // Check duplicate nameEn among active categories
    const existingEn = await prisma.category.findFirst({
      where: {
        nameEn: { equals: nameEn, mode: 'insensitive' },
        deletedAt: null,
      },
    });

    if (existingEn) {
      throw new AppError('يوجد تصنيف آخر بنفس الاسم بالإنجليزي', 400);
    }

    const created = await prisma.category.create({
      data: {
        nameAr,
        nameEn,
        isActive: true,
      },
    });

    return this.formatCategory(created);
  }

  async updateCategory(id: string, input: UpdateCategoryInput): Promise<CategoryResponse> {
    const nameAr = input.nameAr.trim();
    const nameEn = input.nameEn.trim();

    if (!nameAr || !nameEn) {
      throw new AppError('الاسم بالعربي والاسم بالإنجليزي مطلوبان', 400);
    }

    const existingCategory = await prisma.category.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });

    if (!existingCategory) {
      throw new AppError('التصنيف غير موجود', 404);
    }

    // Check duplicate nameAr if changed
    const duplicateAr = await prisma.category.findFirst({
      where: {
        nameAr: { equals: nameAr, mode: 'insensitive' },
        deletedAt: null,
        id: { not: id },
      },
    });

    if (duplicateAr) {
      throw new AppError('يوجد تصنيف آخر بنفس الاسم العربي', 400);
    }

    // Check duplicate nameEn if changed
    const duplicateEn = await prisma.category.findFirst({
      where: {
        nameEn: { equals: nameEn, mode: 'insensitive' },
        deletedAt: null,
        id: { not: id },
      },
    });

    if (duplicateEn) {
      throw new AppError('يوجد تصنيف آخر بنفس الاسم بالإنجليزي', 400);
    }

    const updated = await prisma.category.update({
      where: { id },
      data: {
        nameAr,
        nameEn,
      },
    });

    return this.formatCategory(updated);
  }

  async deleteCategory(id: string): Promise<void> {
    const category = await prisma.category.findFirst({
      where: { id },
    });

    if (!category || category.deletedAt !== null) {
      throw new AppError('التصنيف غير موجود أو محذوف بالفعل', 404);
    }

    const productCount = await prisma.product.count({
      where: {
        categoryId: id,
        deletedAt: null,
      },
    });

    if (productCount > 0) {
      throw new AppError('لا يمكن حذف التصنيف لأنه مرتبط بمنتجات حالية. يرجى تعديل أو حذف المنتجات المرتبطة أولاً.', 400);
    }

    await prisma.category.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        isActive: false,
      },
    });
  }
}

export const categoriesService = new CategoriesService();
