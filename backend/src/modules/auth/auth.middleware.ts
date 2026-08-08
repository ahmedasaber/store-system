import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { jwtConfig } from '../../shared/config/jwt.js';
import { AppError } from '../../shared/utils/appError.js';
import { asyncHandler } from '../../shared/middlewares/asyncHandler.js';
import { authService } from './auth.service.js';
import { JwtTokenPayload } from './auth.types.js';

export const authenticate = asyncHandler(
  async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('Authentication token is missing or malformed', 401);
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new AppError('Authentication token is missing', 401);
    }

    let decodedPayload: JwtTokenPayload;
    try {
      decodedPayload = jwt.verify(token, jwtConfig.secret) as JwtTokenPayload;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new AppError('Token has expired. Please login again.', 401);
      }
      throw new AppError('Invalid authentication token', 401);
    }

    if (!decodedPayload || !decodedPayload.userId) {
      throw new AppError('Invalid token payload', 401);
    }

    // Verify against database - never trust token payload alone
    const userProfile = await authService.getUserProfile(decodedPayload.userId);

    req.user = userProfile;
    next();
  }
);

export const requireRole = (...allowedRoles: string[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new AppError('Authentication required', 401);
    }
    if (!allowedRoles.includes(req.user.userType)) {
      throw new AppError('Forbidden: You do not have permission to perform this action', 403);
    }
    next();
  };
};