import express from 'express';
import { requests } from '../controllers/user.controller.js';
import { protectRoute } from '../middlewares/auth.middleware.js';

const userRouter = express.Router();

userRouter.get('/requests/received', protectRoute, requests);

export default userRouter;
