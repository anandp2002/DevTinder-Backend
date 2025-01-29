import express from 'express';
import connectDB from './config/database.js';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.route.js';
import profileRoutes from './routes/profile.route.js';
import requestRoutes from './routes/request.router.js';
import userRoutes from './routes/user.route.js';
import cors from 'cors';
import { configDotenv } from 'dotenv';

configDotenv();

const app = express();

// To avoid CORS error
app.use(
  cors({
    origin: [
      'http://localhost',
      'http://192.168.1.7',
      'http://192.168.191.74',
      'https://devtinderanandp.vercel.app',
    ],
    credentials: true,
  })
);

// Middleware to parses incoming requests with JSON payloads and makes the parsed data available in req.body
app.use(express.json());

// Middleware to parse cookies and make them accessible via req.cookies
app.use(cookieParser());

app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);
app.use('/request', requestRoutes);
app.use('/user', userRoutes);

connectDB()
  .then(() => {
    console.log('Database connected successfully !');
    app.listen(process.env.PORT, () => {
      console.log('Server is listening on port ' + process.env.PORT);
    });
  })
  .catch((err) => {
    console.log('Error while connecting to DB : ' + err.message);
  });
