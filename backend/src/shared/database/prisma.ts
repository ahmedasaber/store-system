import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';

declare global {
  // eslint-disable-next-line no-var
  var prismaGlobal: PrismaClient | undefined;
}

const createPrismaClient = (): PrismaClient => {
  const pool = new pg.Pool({ connectionString: env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({
    adapter,
    log: env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });
};

export const prisma = globalThis.prismaGlobal ?? createPrismaClient();

if (env.NODE_ENV !== 'production') {
  globalThis.prismaGlobal = prisma;
}

export async function disconnectPrisma(): Promise<void> {
  try {
    await prisma.$disconnect();
    logger.info('Prisma disconnected successfully');
  } catch (error) {
    logger.error('Error disconnecting Prisma:', error);
  }
}

export default prisma;
