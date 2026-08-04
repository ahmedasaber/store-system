import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { ApiResponse } from '../utils/apiResponse.js';
import { logger } from '../utils/logger.js';
import { AppError } from '../utils/appError.js';
import { env } from '../config/env.js';

export const errorHandler = (
  err: Error & { statusCode?: number },
  _req: Request,
  res: Response,
  _next: NextFunction
): Response => {
  logger.error(`Global Error Handler: ${err.message}`, {
    name: err.name,
    stack: env.NODE_ENV === 'development' ? err.stack : undefined,
  });

  if (err instanceof AppError) {
    return ApiResponse.error(res, err.message, err.errors, err.statusCode);
  }

  if (err instanceof ZodError) {
    const formattedErrors = err.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));
    return ApiResponse.error(res, 'Validation Error', formattedErrors, 422);
  }

  const statusCode = err.statusCode || 500;
  const message = env.NODE_ENV === 'production' ? 'Internal Server Error' : err.message;

  return ApiResponse.error(res, message, null, statusCode);
};
