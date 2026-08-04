import { Router } from 'express';

const productsRouter = Router();

productsRouter.get('/status', (_req, res) => {
  res.json({ success: true, message: 'Products module operational' });
});

export default productsRouter;
