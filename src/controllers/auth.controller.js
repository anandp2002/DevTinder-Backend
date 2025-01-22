import { validateSignUpData } from '../utils/validation.js';
import bcrypt from 'bcrypt';
import User from '../models/User.js';
import validator from 'validator';

export const signup = async (req, res) => {
  try {
    const { firstName, lastName, emailId, password } = req.body;
    validateSignUpData(req);

    const hashedPassword = await bcrypt.hash(password, 10);
    const existingUserByEmail = await User.findOne({
      emailId: req.body.emailId,
    });
    if (existingUserByEmail) {
      return res.status(400).send('Email Id already exists, Please login !');
    }

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: hashedPassword,
    });

    const savedUser = await user.save();
    const token = await savedUser.getJWT();
    res.cookie('token', token, { maxAge: 15 * 24 * 60 * 60 * 1000 });
    return res
      .status(201)
      .json({ message: 'User added successfully !', data: savedUser });
  } catch (err) {
    return res.status(400).send(`ERROR : ${err.message}`);
  }
};

export const login = async (req, res) => {
  try {
    const { emailId, password } = req.body;

    if (!validator.isEmail(emailId)) {
      throw new Error('Invalid credentials !');
    }
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error('Invalid credentials !');
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
      const token = await user.getJWT();
      res.cookie('token', token, { maxAge: 15 * 24 * 60 * 60 * 1000 });
      return res.status(200).send(user);
    } else {
      throw new Error('Invalid credentials !');
    }
  } catch (err) {
    return res.status(400).send(`ERROR : ${err.message}`);
  }
};

export const logout = async (req, res) => {
  res.clearCookie('token');
  res.status(200).send('Logged out successfully !');
};
