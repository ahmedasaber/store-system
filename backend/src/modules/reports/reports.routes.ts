import { Router } from 'express';

const reportsRouter = Router();

reportsRouter.get('/status', (_req, res) => {
  res.json({ success: true, message: 'Reports module operational' });
});

export default reportsRouter;
