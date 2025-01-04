import express from 'express';
import { protectRoute } from '../middlewares/auth.middleware.js';
import { sendStatus } from '../controllers/request.controller.js';

const requestRouter = express.Router();

requestRouter.post('/send/:status/:toUserId', protectRoute, sendStatus);

export default requestRouter;
