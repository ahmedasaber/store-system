import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';

import rootRouter from './routes/index.js';
import { corsOptions } from './shared/config/cors.js';
import { logger } from './shared/utils/logger.js';
import { notFoundHandler } from './shared/middlewares/notFound.middleware.js';
import { errorHandler } from './shared/middlewares/error.middleware.js';

export function createApp(): Express {
  const app = express();

  // Security Middlewares
  app.use(cors(corsOptions));
  app.use(
    helmet({
      contentSecurityPolicy: false,
      crossOriginEmbedderPolicy: false,
    })
  );

  // Core Middlewares
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(compression());
  app.use(morgan('combined', { stream: logger.stream }));

  // API Router Registration (/api -> /api/v1/health, etc)
  app.use('/api', rootRouter);

  // 404 Route Not Found Handler
  app.use(notFoundHandler);

  // Global Error Handler
  app.use(errorHandler);

  return app;
}

export default createApp;
