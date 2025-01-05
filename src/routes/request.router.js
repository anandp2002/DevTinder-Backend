import express from 'express';
import { protectRoute } from '../middlewares/auth.middleware.js';
import {
  sendRequest,
  reviewRequest,
} from '../controllers/request.controller.js';

const requestRouter = express.Router();

requestRouter.post('/send/:status/:toUserId', protectRoute, sendRequest);
requestRouter.post('/review/:status/:requestId', protectRoute, reviewRequest);

export default requestRouter;
