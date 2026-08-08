import { Router } from 'express';

import { authenticate, requireRole } from '../auth/auth.middleware.js';
import { validate } from '../../shared/middlewares/validate.middleware.js';
import { categoriesController } from './categories.controller.js';
import {
  categoryParamSchema,
  createCategorySchema,
  queryCategorySchema,
  updateCategorySchema,
} from './categories.validator.js';

const categoriesRouter = Router();

// All routes require authentication
categoriesRouter.use(authenticate);

// GET /api/v1/categories - List categories (ALL roles: ADMIN, EMPLOYEE)
categoriesRouter.get(
  '/',
  validate({ query: queryCategorySchema }),
  categoriesController.getCategories
);

// GET /api/v1/categories/:id - Get category details (ALL roles)
categoriesRouter.get(
  '/:id',
  validate({ params: categoryParamSchema }),
  categoriesController.getCategoryById
);

// POST /api/v1/categories - Create category (ADMIN only)
categoriesRouter.post(
  '/',
  requireRole('ADMIN'),
  validate({ body: createCategorySchema }),
  categoriesController.createCategory
);

// PUT /api/v1/categories/:id - Update category (ADMIN only)
categoriesRouter.put(
  '/:id',
  requireRole('ADMIN'),
  validate({ params: categoryParamSchema, body: updateCategorySchema }),
  categoriesController.updateCategory
);

// DELETE /api/v1/categories/:id - Soft delete category (ADMIN only)
categoriesRouter.delete(
  '/:id',
  requireRole('ADMIN'),
  validate({ params: categoryParamSchema }),
  categoriesController.deleteCategory
);

export default categoriesRouter;
