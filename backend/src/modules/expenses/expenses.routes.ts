import { Router } from 'express';

const expensesRouter = Router();

expensesRouter.get('/status', (_req, res) => {
  res.json({ success: true, message: 'Expenses module operational' });
});

export default expensesRouter;
