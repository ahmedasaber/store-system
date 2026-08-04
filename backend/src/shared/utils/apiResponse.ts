import { Response } from 'express';

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface ApiResponsePayload<T = unknown> {
  success: boolean;
  message: string;
  data?: T | null;
  meta?: PaginationMeta;
  errors?: unknown;
}

export class ApiResponse {
  static success<T>(res: Response, message: string, data?: T, statusCode = 200): Response {
    const payload: ApiResponsePayload<T> = {
      success: true,
      message,
      data: data ?? null,
    };
    return res.status(statusCode).json(payload);
  }

  static created<T>(res: Response, message: string, data?: T): Response {
    return ApiResponse.success(res, message, data, 201);
  }

  static error(res: Response, message: string, errors: unknown = null, statusCode = 400): Response {
    const payload: ApiResponsePayload = {
      success: false,
      message,
      errors: errors ?? null,
    };
    return res.status(statusCode).json(payload);
  }

  static paginated<T>(
    res: Response,
    message: string,
    data: T[],
    meta: PaginationMeta,
    statusCode = 200
  ): Response {
    const payload: ApiResponsePayload<T[]> = {
      success: true,
      message,
      data,
      meta,
    };
    return res.status(statusCode).json(payload);
  }
}
