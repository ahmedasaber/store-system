import { Request, Response } from 'express';
import { ApiResponse } from '../../shared/utils/apiResponse.js';
import { asyncHandler } from '../../shared/middlewares/asyncHandler.js';
import { authService } from './auth.service.js';
import { LoginDto } from './auth.validator.js';

export class AuthController {
  login = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const loginData: LoginDto = req.body;
    const clientIp = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.ip || req.socket.remoteAddress || 'unknown';
    const result = await authService.login(loginData, clientIp);
    return ApiResponse.success(res, 'Login successful', result);
  });

  logout = asyncHandler(async (_req: Request, res: Response): Promise<Response> => {
    return ApiResponse.success(res, 'Logged out successfully.');
  });

  getCurrentUser = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    return ApiResponse.success(res, 'Current user retrieved successfully', req.user);
  });
}

export const authController = new AuthController();
