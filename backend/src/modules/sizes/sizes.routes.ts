import { Router } from 'express';

const sizesRouter = Router();

sizesRouter.get('/status', (_req, res) => {
  res.json({ success: true, message: 'Sizes module operational' });
});

export default sizesRouter;
