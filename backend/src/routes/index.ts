import { Router } from 'express';
import { ApiResponse } from '../shared/utils/apiResponse.js';
import { env } from '../shared/config/env.js';

import { authRouter } from '../modules/auth/index.js';
import { branchesRouter } from '../modules/branches/index.js';
import { usersRouter } from '../modules/users/index.js';
import { sizesRouter } from '../modules/sizes/index.js';
import { categoriesRouter } from '../modules/categories/index.js';
import { productsRouter } from '../modules/products/index.js';
import { inventoryRouter } from '../modules/inventory/index.js';
import { salesRouter } from '../modules/sales/index.js';
import { purchasesRouter } from '../modules/purchases/index.js';
import { returnsRouter } from '../modules/returns/index.js';
import { customersRouter } from '../modules/customers/index.js';
import { suppliersRouter } from '../modules/suppliers/index.js';
import { expensesRouter } from '../modules/expenses/index.js';
import { reportsRouter } from '../modules/reports/index.js';
import { dashboardRouter } from '../modules/dashboard/index.js';

const rootRouter = Router();
const v1Router = Router();

// GET /api/v1/health
v1Router.get('/health', (_req, res) => {
  return ApiResponse.success(res, 'Server is healthy', {
    status: 'UP',
    uptime: `${process.uptime().toFixed(2)}s`,
    timestamp: new Date().toISOString(),
    environment: env.NODE_ENV,
  });
});

// Feature Modules Registration
v1Router.use('/auth', authRouter);
v1Router.use('/branches', branchesRouter);
v1Router.use('/users', usersRouter);
v1Router.use('/sizes', sizesRouter);
v1Router.use('/categories', categoriesRouter);
v1Router.use('/products', productsRouter);
v1Router.use('/inventory', inventoryRouter);
v1Router.use('/sales', salesRouter);
v1Router.use('/purchases', purchasesRouter);
v1Router.use('/returns', returnsRouter);
v1Router.use('/customers', customersRouter);
v1Router.use('/suppliers', suppliersRouter);
v1Router.use('/expenses', expensesRouter);
v1Router.use('/reports', reportsRouter);
v1Router.use('/dashboard', dashboardRouter);

rootRouter.use('/v1', v1Router);

export default rootRouter;
