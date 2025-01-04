import express from 'express';
import { protectRoute } from '../middlewares/auth.middleware.js';
import { view, edit, password } from '../controllers/profile.controller.js';

const profileRouter = express.Router();

profileRouter.get('/view', protectRoute, view);
profileRouter.patch('/edit', protectRoute, edit);
profileRouter.patch('/password', protectRoute, password);

export default profileRouter;
