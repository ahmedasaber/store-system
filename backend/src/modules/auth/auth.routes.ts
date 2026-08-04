import { Router } from 'express';
import { validate } from '../../shared/middlewares/validate.middleware.js';
import { loginSchema } from './auth.validator.js';
import { authController } from './auth.controller.js';
import { authenticate } from './auth.middleware.js';

const authRouter = Router();

// POST /api/v1/auth/login
authRouter.post('/login', validate({ body: loginSchema }), authController.login);

// POST /api/v1/auth/logout
authRouter.post('/logout', authController.logout);

// GET /api/v1/auth/me
authRouter.get('/me', authenticate, authController.getCurrentUser);

export default authRouter;
