import bcrypt from 'bcryptjs';
import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import prisma from '../../shared/database/prisma.js';
import { jwtConfig } from '../../shared/config/jwt.js';
import { AppError } from '../../shared/utils/appError.js';
import { logger } from '../../shared/utils/logger.js';
import { LoginDto } from './auth.validator.js';
import {
  JwtTokenPayload,
  LoginResponseData,
  UserAuthProfile,
  AssignedBranchInfo,
} from './auth.types.js';

export class AuthService {
  private formatAssignedBranches(
    assignedBranches: {
      userId: string;
      branchId: string;
      branch: {
        id: string;
        name: string;
        code: string;
        isActive: boolean;
      };
    }[]
  ): AssignedBranchInfo[] {
    return assignedBranches.map((ub) => ({
      branchId: ub.branch.id,
      branchName: ub.branch.name,
      branchCode: ub.branch.code,
      isActive: ub.branch.isActive,
    }));
  }

  async login(credentials: LoginDto, clientIp = 'unknown'): Promise<LoginResponseData> {
    const { email, password } = credentials;
    const normalizedEmail = email.trim().toLowerCase();

    const user = await prisma.user.findFirst({
      where: {
        email: normalizedEmail,
        deletedAt: null,
      },
      include: {
        assignedBranches: {
          include: {
            branch: {
              select: {
                id: true,
                name: true,
                code: true,
                isActive: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      logger.warn(`Failed login attempt [IP: ${clientIp}]: Email not found (${normalizedEmail})`);
      throw new AppError('Invalid email or password', 401);
    }

    if (!user.isActive) {
      logger.warn(`Failed login attempt [IP: ${clientIp}]: Inactive user account (${normalizedEmail})`);
      throw new AppError('Account is inactive. Please contact administrator.', 403);
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      logger.warn(`Failed login attempt [IP: ${clientIp}]: Invalid password for user (${normalizedEmail})`);
      throw new AppError('Invalid email or password', 401);
    }

    const payload: JwtTokenPayload = {
      userId: user.id,
      userType: user.userType,
      tokenVersion: 1,
    };

    const tokenOptions: SignOptions = {
      expiresIn: jwtConfig.expiresIn as jwt.SignOptions['expiresIn'],
    };

    const accessToken = jwt.sign(payload, jwtConfig.secret as Secret, tokenOptions);

    const userProfile: UserAuthProfile = {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      userType: user.userType,
      isActive: user.isActive,
      assignedBranches: this.formatAssignedBranches(user.assignedBranches),
    };

    logger.info(`Successful login [IP: ${clientIp}]: User (${user.email}, ID: ${user.id})`);

    return {
      accessToken,
      user: userProfile,
    };
  }

  async getUserProfile(userId: string): Promise<UserAuthProfile> {
    const user = await prisma.user.findFirst({
      where: {
        id: userId,
        deletedAt: null,
      },
      include: {
        assignedBranches: {
          include: {
            branch: {
              select: {
                id: true,
                name: true,
                code: true,
                isActive: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new AppError('User not found or has been removed', 404);
    }

    if (!user.isActive) {
      throw new AppError('Account is inactive. Access denied.', 403);
    }

    return {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      userType: user.userType,
      isActive: user.isActive,
      assignedBranches: this.formatAssignedBranches(user.assignedBranches),
    };
  }
}

export const authService = new AuthService();
