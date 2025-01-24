import express from 'express';
import connectDB from './config/database.js';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.route.js';
import profileRoutes from './routes/profile.route.js';
import requestRoutes from './routes/request.router.js';
import userRoutes from './routes/user.route.js';
import cors from 'cors';

const app = express();

// To avoid CORS error
app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'http://192.168.1.2:5173',
      'http://192.168.191.74:5173',
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
    app.listen(3000, () => {
      console.log('Server is listening on port 3000...');
    });
  })
  .catch((err) => {
    console.log('Error while connecting to DB : ' + err.message);
  });
