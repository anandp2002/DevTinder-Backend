import mongoose from 'mongoose';

const connectDB = async () => {
  await mongoose.connect(
    'mongodb+srv://anandp9207:HVeD3ouKwhBnLo4M@namastenode.c5vtx.mongodb.net/devTinder'
  );
};

export default connectDB;
