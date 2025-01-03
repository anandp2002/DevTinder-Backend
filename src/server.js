import express from 'express';
import connectDB from './config/database.js';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.route.js';
import profileRoutes from './routes/profile.route.js';
import requestRoutes from './routes/request.router.js';

const app = express();

// Middleware to parses incoming requests with JSON payloads and makes the parsed data available in req.body
app.use(express.json());
// Middleware to parse cookies and make them accessible via req.cookies
app.use(cookieParser());

// app.get('/feed', async (req, res) => {
//   try {
//     const users = await User.find({});
//     if (users.length === 0) {
//       res.send('No users available !');
//     }
//     res.status(200).send(users);
//   } catch {
//     res.send('Error in /feed api ');
//   }
// });

// app.patch('/user', async (req, res) => {
//   const userId = req.body.userId;
//   const data = req.body;

//   try {
//     const ALLOWED_UPDATES = [
//       'userId',
//       'photoUrl',
//       'about',
//       'gender',
//       'age',
//       'skills',
//     ];
//     const isUpdateAllowed = Object.keys(data).every((k) =>
//       ALLOWED_UPDATES.includes(k)
//     );
//     if (!isUpdateAllowed) {
//       throw new Error('Update not allowed !');
//     }

//     if (data?.skills.length > 10) {
//       throw new Error('Skills cannot be more than 10');
//     }

//     const user = await User.findByIdAndUpdate(userId, data, {
//       returnDocument: 'after', // Will give the updated document
//       runValidators: true,
//     });

//     console.log(user);
//     res.send('User updated successfully');
//   } catch (err) {
//     console.error(err); // Log the error for debugging.
//     res.status(400).send('Error in updating user');
//   }
// });

app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);
app.use('/request', requestRoutes);

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
