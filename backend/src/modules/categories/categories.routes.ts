import { Router } from 'express';

const categoriesRouter = Router();

categoriesRouter.get('/status', (_req, res) => {
  res.json({ success: true, message: 'Categories module operational' });
});

export default categoriesRouter;
