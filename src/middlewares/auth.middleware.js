import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protectRoute = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).send('Please Login !');
    }
    const decodedMessage = await jwt.verify(token, 'jwt secret secret key');
    const user = await User.findById(decodedMessage._id);
    if (!user) {
      throw new Error('User does not exist !');
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(400).send('ERROR : ' + err.message);
  }
};
