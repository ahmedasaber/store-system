import { Router } from 'express';

const branchesRouter = Router();

branchesRouter.get('/status', (_req, res) => {
  res.json({ success: true, message: 'Branches module operational' });
});

export default branchesRouter;
