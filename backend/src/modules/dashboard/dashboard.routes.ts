import { Router } from 'express';

const dashboardRouter = Router();

dashboardRouter.get('/status', (_req, res) => {
  res.json({ success: true, message: 'Dashboard module operational' });
});

export default dashboardRouter;
