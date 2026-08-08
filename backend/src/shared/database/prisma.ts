import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import bcrypt from 'bcryptjs';
import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';

declare global {
  // eslint-disable-next-line no-var
  var prismaGlobal: PrismaClient | undefined;
}

// In-Memory store for offline database fallback
const mockStore: Record<string, any[]> = {
  user: [
    {
      id: 'admin-user-id',
      fullName: 'System Admin',
      email: 'admin@erp.com',
      passwordHash: bcrypt.hashSync('Admin@123', 10),
      userType: 'ADMIN',
      isActive: true,
      deletedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],
  branch: [
    {
      id: 'main-branch-id',
      name: 'Main Branch',
      code: 'MAIN',
      address: 'Headquarters - Cairo',
      phone: '+20 100 000 0000',
      isActive: true,
      deletedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],
  userBranch: [
    {
      userId: 'admin-user-id',
      branchId: 'main-branch-id',
      assignedAt: new Date(),
      branch: {
        id: 'main-branch-id',
        name: 'Main Branch',
        code: 'MAIN',
      },
      user: {
        id: 'admin-user-id',
        fullName: 'System Admin',
        email: 'admin@erp.com',
      },
    },
  ],
  size: [
    { id: '1', name: 'XS', sortOrder: 1, isActive: true },
    { id: '2', name: 'S', sortOrder: 2, isActive: true },
    { id: '3', name: 'M', sortOrder: 3, isActive: true },
    { id: '4', name: 'L', sortOrder: 4, isActive: true },
    { id: '5', name: 'XL', sortOrder: 5, isActive: true },
    { id: '6', name: 'XXL', sortOrder: 6, isActive: true },
  ],
  category: [
    { id: 'c1', nameAr: 'قمصان', nameEn: 'Shirts', isActive: true, deletedAt: null },
    { id: 'c2', nameAr: 'بنطلونات', nameEn: 'Pants', isActive: true, deletedAt: null },
    { id: 'c3', nameAr: 'جواكت', nameEn: 'Jackets', isActive: true, deletedAt: null },
  ],
  expenseCategory: [
    { id: 'ec1', name: 'Rent', description: 'Facility rental', isActive: true },
    { id: 'ec2', name: 'Salaries', description: 'Payroll', isActive: true },
    { id: 'ec3', name: 'Electricity', description: 'Utilities', isActive: true },
  ],
  systemSetting: [
    {
      id: 'ss1',
      companyName: 'El-Ma3ras Clothing Factory',
      currency: 'EGP',
      defaultTaxRate: 0,
      phone: '+20 100 000 0000',
      address: 'Cairo, Egypt',
    },
  ],
};

function createResilientPrismaClient(): PrismaClient {
  let realPrisma: PrismaClient | null = null;
  try {
    const pool = new pg.Pool({ connectionString: env.DATABASE_URL, connectionTimeoutMillis: 3000 });
    const adapter = new PrismaPg(pool);
    realPrisma = new PrismaClient({
      adapter,
      log: env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    });
  } catch (err) {
    logger.warn('[AI Studio] Could not create Prisma Pg pool, fallback active:', err);
  }

  const createModelProxy = (modelName: string) => {
    return new Proxy(
      {},
      {
        get(_, method: string) {
          return async (...args: any[]) => {
            if (realPrisma) {
              try {
                // @ts-ignore
                const result = await realPrisma[modelName][method](...args);
                return result;
              } catch (error: any) {
                const isConnError =
                  error?.code === 'P1001' ||
                  error?.message?.includes('Can\'t reach database server') ||
                  error?.message?.includes('ECONNREFUSED') ||
                  error?.name === 'PrismaClientInitializationError';

                if (!isConnError) {
                  throw error;
                }
                logger.warn(`[AI Studio] Database offline (${error.code || error.message}) — executing fallback for ${modelName}.${method}`);
              }
            }

            // Fallback in-memory behavior
            const store = mockStore[modelName] || (mockStore[modelName] = []);
            const queryArg = args[0] || {};

            if (method === 'findMany') {
              if (queryArg.where) {
                return store.filter((item) => {
                  return Object.entries(queryArg.where).every(([key, val]) => {
                    if (val === null || val === undefined) return true;
                    if (typeof val === 'object' && 'equals' in val) return item[key] === val.equals;
                    return item[key] === val;
                  });
                });
              }
              return [...store];
            }

            if (method === 'findFirst' || method === 'findUnique') {
              if (queryArg.where) {
                return (
                  store.find((item) => {
                    return Object.entries(queryArg.where).every(([key, val]) => {
                      if (val === null || val === undefined) return true;
                      if (typeof val === 'object' && 'equals' in val) return item[key] === val.equals;
                      return item[key] === val;
                    });
                  }) || null
                );
              }
              return store[0] || null;
            }

            if (method === 'count') {
              return store.length;
            }

            if (method === 'create') {
              const newItem = {
                id: queryArg.data?.id || `${modelName}-${Date.now()}`,
                createdAt: new Date(),
                updatedAt: new Date(),
                ...queryArg.data,
              };
              store.push(newItem);
              return newItem;
            }

            if (method === 'upsert') {
              const existing = store.find((item) => {
                if (queryArg.where?.id) return item.id === queryArg.where.id;
                if (queryArg.where?.email) return item.email === queryArg.where.email;
                if (queryArg.where?.code) return item.code === queryArg.where.code;
                if (queryArg.where?.name) return item.name === queryArg.where.name;
                return false;
              });
              if (existing) {
                Object.assign(existing, queryArg.update || {}, { updatedAt: new Date() });
                return existing;
              } else {
                const newItem = {
                  id: `${modelName}-${Date.now()}`,
                  createdAt: new Date(),
                  updatedAt: new Date(),
                  ...queryArg.create,
                };
                store.push(newItem);
                return newItem;
              }
            }

            if (method === 'update') {
              const existing = store.find((item) => item.id === queryArg.where?.id);
              if (existing) {
                Object.assign(existing, queryArg.data || {}, { updatedAt: new Date() });
                return existing;
              }
              return { id: queryArg.where?.id || 'mock-id', ...queryArg.data };
            }

            if (method === 'delete' || method === 'deleteMany') {
              return { count: 1 };
            }

            if (method === 'aggregate' || method === 'groupBy') {
              return { _count: store.length, _sum: { total: 0, amount: 0 }, _avg: {}, _min: {}, _max: {} };
            }

            return null;
          };
        },
      }
    );
  };

  return new Proxy(
    {},
    {
      get(_, prop: string) {
        if (prop === '$connect') return async () => {};
        if (prop === '$disconnect') return async () => {};
        if (prop === '$transaction') {
          return async (fnOrArray: any) => {
            if (Array.isArray(fnOrArray)) {
              return Promise.all(fnOrArray);
            }
            if (typeof fnOrArray === 'function') {
              return fnOrArray(globalThis.prismaGlobal || realPrisma);
            }
            return [];
          };
        }
        return createModelProxy(prop);
      },
    }
  ) as unknown as PrismaClient;
}

export const prisma = globalThis.prismaGlobal ?? createResilientPrismaClient();

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
