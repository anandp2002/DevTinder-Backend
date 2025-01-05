import express from 'express';
import { requests, connections } from '../controllers/user.controller.js';
import { protectRoute } from '../middlewares/auth.middleware.js';

const userRouter = express.Router();

userRouter.get('/requests/received', protectRoute, requests);
userRouter.get('/connections', protectRoute, connections);

export default userRouter;
