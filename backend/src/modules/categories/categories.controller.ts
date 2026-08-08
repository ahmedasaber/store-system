import { Request, Response } from 'express';
import { asyncHandler } from '../../shared/middlewares/asyncHandler.js';
import { ApiResponse } from '../../shared/utils/apiResponse.js';
import { categoriesService } from './categories.service.js';

export class CategoriesController {
  getCategories = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const result = await categoriesService.listCategories(req.query as any);
    return ApiResponse.paginated(
      res,
      'تم جلب التصنيفات بنجاح',
      result.data,
      result.meta
    );
  });

  getCategoryById = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const category = await categoriesService.getCategoryById(req.params.id);
    return ApiResponse.success(res, 'تم جلب التصنيف بنجاح', category);
  });

  createCategory = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const category = await categoriesService.createCategory(req.body);
    return ApiResponse.created(res, 'تم إنشاء التصنيف بنجاح', category);
  });

  updateCategory = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const category = await categoriesService.updateCategory(req.params.id, req.body);
    return ApiResponse.success(res, 'تم تحديث التصنيف بنجاح', category);
  });

  deleteCategory = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    await categoriesService.deleteCategory(req.params.id);
    return ApiResponse.success(res, 'تم حذف التصنيف بنجاح', null);
  });
}

export const categoriesController = new CategoriesController();
