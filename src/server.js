import express from 'express';
import connectDB from './config/database.js';
import User from './models/User.js';
import validator from 'validator';

const app = express();

// Middleware to parses incoming requests with JSON payloads and makes the parsed data available in req.body
app.use(express.json());

app.post('/signup', async (req, res) => {
  try {
    const { firstName, emailId, password } = req.body;
    if (!emailId || !password || !firstName) {
      return res
        .status(400)
        .json({ success: false, message: 'All fields are required' });
    }
    if (!validator.isEmail(emailId)) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid email format' });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be atleast 6 characters',
      });
    }
    const user = new User(req.body);
    await user.save();
    res.status(201).send('User added successfully !');
  } catch (err) {
    res.status(400).send('Error creating user : ', err.message);
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
