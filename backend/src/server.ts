import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { createApp } from './app.js';
import { env } from './shared/config/env.js';
import { logger } from './shared/utils/logger.js';
import { disconnectPrisma } from './shared/database/prisma.js';

const app = createApp();

async function startServer() {
  if (env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      configFile: path.join(process.cwd(), 'frontend', 'vite.config.ts'),
      root: path.join(process.cwd(), 'frontend'),
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'frontend', 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const server = app.listen(env.PORT, env.HOST, () => {
    logger.info(`[El-Ma3ras ERP Backend] Running at http://${env.HOST}:${env.PORT} in ${env.NODE_ENV} mode`);
  });

  const gracefulShutdown = async (signal: string) => {
    logger.info(`${signal} signal received: closing HTTP server`);
    server.close(async () => {
      logger.info('HTTP server closed');
      await disconnectPrisma();
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));
}

startServer().catch((err) => {
  logger.error('Failed to start server:', err);
  process.exit(1);
});
