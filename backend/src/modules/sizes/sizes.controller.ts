import { Request, Response } from 'express';
import { asyncHandler } from '../../shared/middlewares/asyncHandler.js';
import { ApiResponse } from '../../shared/utils/apiResponse.js';
import { sizesService } from './sizes.service.js';

export class SizesController {
  getSizes = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const result = await sizesService.listSizes(req.query as any);
    return ApiResponse.paginated(
      res,
      'تم جلب المقاسات بنجاح',
      result.data,
      result.meta
    );
  });

  getSizeById = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const size = await sizesService.getSizeById(req.params.id);
    return ApiResponse.success(res, 'تم جلب المقاس بنجاح', size);
  });

  createSize = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const size = await sizesService.createSize(req.body);
    return ApiResponse.created(res, 'تم إنشاء المقاس بنجاح', size);
  });

  updateSize = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const size = await sizesService.updateSize(req.params.id, req.body);
    return ApiResponse.success(res, 'تم تحديث المقاس بنجاح', size);
  });

  deleteSize = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    await sizesService.deleteSize(req.params.id);
    return ApiResponse.success(res, 'تم حذف المقاس بنجاح', null);
  });
}

export const sizesController = new SizesController();
