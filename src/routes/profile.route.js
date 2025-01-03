import express from 'express';
import { protectRoute } from '../middlewares/auth.middleware.js';
import { validateEditProfileData } from '../utils/validation.js';

const profileRouter = express.Router();

profileRouter.get('/view', protectRoute, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    return res.status(400).send(`ERROR : ${err.message}`);
  }
});

profileRouter.patch('/edit', protectRoute, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      throw new Error('Invalid edit request !');
    }
    const loggedInUser = req.user;
    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
    await loggedInUser.save();
    res
      .status(200)
      .json({ message: 'Profile updated successfully !', data: loggedInUser });
  } catch (err) {
    res.status(400).send('ERROR : ' + err.message);
  }
});

export default profileRouter;
