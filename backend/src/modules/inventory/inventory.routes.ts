import { Router } from 'express';

const inventoryRouter = Router();

inventoryRouter.get('/status', (_req, res) => {
  res.json({ success: true, message: 'Inventory module operational' });
});

export default inventoryRouter;
