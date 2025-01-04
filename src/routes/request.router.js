import express from 'express';
import { protectRoute } from '../middlewares/auth.middleware.js';
import { sendConnectionRequest } from '../controllers/request.controller.js';

const requestRouter = express.Router();

requestRouter.post(
  '/sendConnectionRequest',
  protectRoute,
  sendConnectionRequest
);

export default requestRouter;
