import { Router } from 'express';

const customersRouter = Router();

customersRouter.get('/status', (_req, res) => {
  res.json({ success: true, message: 'Customers module operational' });
});

export default customersRouter;
