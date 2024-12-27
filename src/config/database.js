const mongoose = require('mongoose');

const connectDB = async () => {
  await mongoose.connect(
    'mongodb+srv://anandp9207:HVeD3ouKwhBnLo4M@namastenode.c5vtx.mongodb.net/devTinder'
  );
};

module.exports = connectDB;
