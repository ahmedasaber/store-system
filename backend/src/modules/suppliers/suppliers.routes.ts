import { Router } from 'express';

const suppliersRouter = Router();

suppliersRouter.get('/status', (_req, res) => {
  res.json({ success: true, message: 'Suppliers module operational' });
});

export default suppliersRouter;
