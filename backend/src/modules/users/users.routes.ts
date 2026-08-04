import { Router } from 'express';

const usersRouter = Router();

usersRouter.get('/status', (_req, res) => {
  res.json({ success: true, message: 'Users module operational' });
});

export default usersRouter;
