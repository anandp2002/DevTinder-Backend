import express from 'express';
import connectDB from './config/database.js';
import User from './models/User.js';
import validator from 'validator';
import { validateSignUpData } from './utils/validation.js';
import bcrypt from 'bcrypt';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';

const app = express();

// Middleware to parses incoming requests with JSON payloads and makes the parsed data available in req.body
app.use(express.json());

// Middleware to parse cookies and make them accessible via req.cookies
app.use(cookieParser());

app.post('/signup', async (req, res) => {
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
    await user.save();
    return res.status(201).send('User added successfully !');
  } catch (err) {
    return res.status(400).send(`ERROR : ${err.message}`);
  }
});

app.post('/login', async (req, res) => {
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
      const token = await jwt.sign({ _id: user._id }, 'jwt secret secret key');
      res.cookie('token', token);
      return res.status(200).send('Login success !');
    } else {
      throw new Error('Invalid credentials !');
    }
  } catch (err) {
    return res.status(400).send(`ERROR : ${err.message}`);
  }
});

app.get('/profile', async (req, res) => {
  try {
    const cookies = req.cookies;
    const { token } = cookies;
    if (!token) {
      throw new Error('Invalid Token !');
    }
    const decodedMessage = await jwt.verify(token, 'jwt secret secret key');
    const user = await User.findById(decodedMessage._id);
    if (!user) {
      throw new Error('User does not exist !');
    }
    res.send(user);
  } catch (err) {
    return res.status(400).send(`ERROR : ${err.message}`);
  }
});

app.get('/feed', async (req, res) => {
  try {
    const users = await User.find({});
    if (!users) {
      res.send('No users available !');
    }
    res.status(200).send(users);
  } catch {
    res.send('Error in /feed api ');
  }
});

app.patch('/user', async (req, res) => {
  const userId = req.body.userId;
  const data = req.body;

  try {
    const ALLOWED_UPDATES = [
      'userId',
      'photoUrl',
      'about',
      'gender',
      'age',
      'skills',
    ];
    const isUpdateAllowed = Object.keys(data).every((k) =>
      ALLOWED_UPDATES.includes(k)
    );
    if (!isUpdateAllowed) {
      throw new Error('Update not allowed !');
    }

    if (data?.skills.length > 10) {
      throw new Error('Skills cannot be more than 10');
    }

    const user = await User.findByIdAndUpdate(userId, data, {
      returnDocument: 'after', // Will give the updated document
      runValidators: true,
    });

    console.log(user);
    res.send('User updated successfully');
  } catch (err) {
    console.error(err); // Log the error for debugging.
    res.status(400).send('Error in updating user');
  }
});

connectDB()
  .then(() => {
    console.log('Database connected successfully !');
    app.listen(3000, () => {
      console.log('Server is listening on port 3000...');
    });
  })
  .catch(() => {
    console.log('Error while connecting to DB !');
  });
