import { Request } from 'express';
import { UserAuthProfile } from '../../modules/auth/auth.types.js';

export interface AuthenticatedRequest extends Request {
  user?: UserAuthProfile;
  activeBranchId?: string;
}

export * from '../../modules/auth/auth.types.js';
