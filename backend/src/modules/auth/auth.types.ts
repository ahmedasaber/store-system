import { UserType } from '@prisma/client';

export interface LoginInput {
  email: string;
  password: string;
}

export interface JwtTokenPayload {
  userId: string;
  userType: UserType;
  tokenVersion: number;
}

export interface AssignedBranchInfo {
  branchId: string;
  branchName: string;
  branchCode: string;
  isActive: boolean;
}

export interface UserAuthProfile {
  id: string;
  fullName: string;
  email: string;
  userType: UserType;
  isActive: boolean;
  assignedBranches: AssignedBranchInfo[];
}

export interface LoginResponseData {
  accessToken: string;
  user: UserAuthProfile;
}

declare global {
  namespace Express {
    interface Request {
      user?: UserAuthProfile;
    }
  }
}
