import { Router } from 'express';

const returnsRouter = Router();

returnsRouter.get('/status', (_req, res) => {
  res.json({ success: true, message: 'Returns module operational' });
});

export default returnsRouter;
