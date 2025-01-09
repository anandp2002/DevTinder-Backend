import express from 'express';
import {
  requests,
  connections,
  userFeed,
} from '../controllers/user.controller.js';
import { protectRoute } from '../middlewares/auth.middleware.js';

const userRouter = express.Router();

userRouter.get('/requests/received', protectRoute, requests);
userRouter.get('/connections', protectRoute, connections);
userRouter.get('/feed', protectRoute, userFeed);

export default userRouter;
