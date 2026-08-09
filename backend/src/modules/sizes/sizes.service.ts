import { prisma } from '../../shared/database/prisma.js';
import { AppError } from '../../shared/utils/appError.js';
import {
  CreateSizeInput,
  QuerySizesInput,
  SizeResponse,
  UpdateSizeInput,
} from './sizes.types.js';

export class SizesService {
  private formatSize(size: any): SizeResponse {
    return {
      id: size.id,
      name: size.name,
      sortOrder: size.sortOrder,
      isActive: size.isActive,
      createdAt: size.createdAt,
      updatedAt: size.updatedAt,
      deletedAt: size.deletedAt,
    };
  }

  async listSizes(query: QuerySizesInput) {
    const page = query.page && query.page > 0 ? Number(query.page) : 1;
    const limit = query.limit && query.limit > 0 ? Number(query.limit) : 10;
    const skip = (page - 1) * limit;

    const whereClause: any = {
      deletedAt: null,
    };

    if (query.search && query.search.trim() !== '') {
      const searchTerm = query.search.trim();
      whereClause.name = { contains: searchTerm, mode: 'insensitive' };
    }

    const [total, records] = await Promise.all([
      prisma.size.count({ where: whereClause }),
      prisma.size.findMany({
        where: whereClause,
        orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
        skip,
        take: limit,
      }),
    ]);

    const totalPages = Math.ceil(total / limit) || 1;

    return {
      data: records.map(this.formatSize),
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

  async getSizeById(id: string): Promise<SizeResponse> {
    const size = await prisma.size.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });

    if (!size) {
      throw new AppError('المقاس غير موجود', 404);
    }

    return this.formatSize(size);
  }

  async createSize(input: CreateSizeInput): Promise<SizeResponse> {
    const name = input.name.trim();

    if (!name) {
      throw new AppError('اسم المقاس مطلوب', 400);
    }

    // Check duplicate name among active sizes
    const existing = await prisma.size.findFirst({
      where: {
        name: { equals: name, mode: 'insensitive' },
        deletedAt: null,
      },
    });

    if (existing) {
      throw new AppError('يوجد مقاس آخر بنفس الاسم', 400);
    }

    const created = await prisma.size.create({
      data: {
        name,
        sortOrder: input.sortOrder ?? 0,
        isActive: true,
      },
    });

    return this.formatSize(created);
  }

  async updateSize(id: string, input: UpdateSizeInput): Promise<SizeResponse> {
    const name = input.name.trim();

    if (!name) {
      throw new AppError('اسم المقاس مطلوب', 400);
    }

    const existingSize = await prisma.size.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });

    if (!existingSize) {
      throw new AppError('المقاس غير موجود', 404);
    }

    // Check duplicate name if changed
    const duplicate = await prisma.size.findFirst({
      where: {
        name: { equals: name, mode: 'insensitive' },
        deletedAt: null,
        id: { not: id },
      },
    });

    if (duplicate) {
      throw new AppError('يوجد مقاس آخر بنفس الاسم', 400);
    }

    const updated = await prisma.size.update({
      where: { id },
      data: {
        name,
        sortOrder: input.sortOrder,
      },
    });

    return this.formatSize(updated);
  }

  async deleteSize(id: string): Promise<void> {
    const size = await prisma.size.findFirst({
      where: { id },
    });

    if (!size || size.deletedAt !== null) {
      throw new AppError('المقاس غير موجود أو محذوف بالفعل', 404);
    }

    // Check reference in ProductSize
    const productSizeCount = await prisma.productSize.count({
      where: {
        sizeId: id,
        deletedAt: null,
      },
    });

    if (productSizeCount > 0) {
      throw new AppError('لا يمكن حذف المقاس لأنه مرتبط بمنتجات حالية. يرجى تعديل أو حذف المقاسات المرتبطة أولاً.', 400);
    }

    await prisma.size.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        isActive: false,
      },
    });
  }
}

export const sizesService = new SizesService();
