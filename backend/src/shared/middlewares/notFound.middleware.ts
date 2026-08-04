import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../utils/apiResponse.js';

export const notFoundHandler = (req: Request, res: Response, _next: NextFunction): Response => {
  return ApiResponse.error(res, `Route not found: ${req.method} ${req.originalUrl}`, null, 404);
};
