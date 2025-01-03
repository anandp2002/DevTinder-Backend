import express from 'express';
import { protectRoute } from '../middlewares/auth.middleware.js';

const requestRouter = express.Router();

requestRouter.post('/sendConnectionRequest', protectRoute, async (req, res) => {
  const user = req.user;
  console.log('Sending connection request');
  res.status(200).send(user.firstName + ' sent connection request !');
});

export default requestRouter;
