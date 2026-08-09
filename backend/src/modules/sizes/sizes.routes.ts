import { Router } from 'express';
import { authenticate, requireRole } from '../auth/auth.middleware.js';
import { validate } from '../../shared/middlewares/validate.middleware.js';
import { sizesController } from './sizes.controller.js';
import {
  createSizeSchema,
  querySizeSchema,
  sizeParamSchema,
  updateSizeSchema,
} from './sizes.validator.js';

const sizesRouter = Router();

// All routes require authentication
sizesRouter.use(authenticate);

// GET /api/v1/sizes - List sizes (ALL roles: ADMIN, EMPLOYEE)
sizesRouter.get(
  '/',
  validate({ query: querySizeSchema }),
  sizesController.getSizes
);

// GET /api/v1/sizes/:id - Get size details (ALL roles)
sizesRouter.get(
  '/:id',
  validate({ params: sizeParamSchema }),
  sizesController.getSizeById
);

// POST /api/v1/sizes - Create size (ADMIN only)
sizesRouter.post(
  '/',
  requireRole('ADMIN'),
  validate({ body: createSizeSchema }),
  sizesController.createSize
);

// PUT /api/v1/sizes/:id - Update size (ADMIN only)
sizesRouter.put(
  '/:id',
  requireRole('ADMIN'),
  validate({ params: sizeParamSchema, body: updateSizeSchema }),
  sizesController.updateSize
);

// DELETE /api/v1/sizes/:id - Soft delete size (ADMIN only)
sizesRouter.delete(
  '/:id',
  requireRole('ADMIN'),
  validate({ params: sizeParamSchema }),
  sizesController.deleteSize
);

export default sizesRouter;
