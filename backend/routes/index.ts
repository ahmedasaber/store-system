import { Router } from 'express';

const apiRouter = Router();

// Module sub-routers will be registered here in future phases
apiRouter.get('/status', (_req, res) => {
  res.json({ success: true, message: 'ERP API Routes Ready' });
});

export default apiRouter;
