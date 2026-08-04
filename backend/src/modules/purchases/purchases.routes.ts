import { Router } from 'express';

const purchasesRouter = Router();

purchasesRouter.get('/status', (_req, res) => {
  res.json({ success: true, message: 'Purchases module operational' });
});

export default purchasesRouter;
