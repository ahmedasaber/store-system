import { Request } from 'express';

export interface JwtPayload {
  userId: string;
  email: string;
  userType: 'ADMIN' | 'EMPLOYEE';
}

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
  activeBranchId?: string;
}
