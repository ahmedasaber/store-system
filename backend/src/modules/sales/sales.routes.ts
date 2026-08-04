import { Router } from 'express';

const salesRouter = Router();

salesRouter.get('/status', (_req, res) => {
  res.json({ success: true, message: 'Sales module operational' });
});

export default salesRouter;
