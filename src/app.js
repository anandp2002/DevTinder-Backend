const express = require('express');
const connectDB = require('./config/database');
const User = require('./models/User');

const app = express();

// Middleware to parses incoming requests with JSON payloads and makes the parsed data available in req.body
app.use(express.json());

app.post('/signup', async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    res.status(201).send('User added successfully');
  } catch (err) {
    res.status(400).send('Error creating user ', err.message);
  }
});

connectDB()
  .then(() => {
    console.log('Database connected successfully');
    app.listen(3000, () => {
      console.log('Server is listening on port 3000');
    });
  })
  .catch(() => {
    console.log('Error while connecting to DB');
  });
