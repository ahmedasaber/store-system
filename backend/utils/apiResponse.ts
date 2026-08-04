import { Response } from 'express';

export interface ApiResponseData<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: any;
}

export class ApiResponse {
  static success<T>(res: Response, message: string, data?: T, statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data: data ?? null,
    });
  }

  static error(res: Response, message: string, errors: any = null, statusCode = 400) {
    return res.status(statusCode).json({
      success: false,
      message,
      errors,
    });
  }
}
