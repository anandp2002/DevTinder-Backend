import mongoose from 'mongoose';
import validator from 'validator';
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minlength: 3,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      validate(gender) {
        if (!['male', 'female', 'others'].includes(gender)) {
          throw new Error('Gender data is not valid !');
        }
      },
    },
    photoUrl: {
      type: String,
      default:
        'https://photosly.in/wp-content/uploads/2024/04/profile-whatsapp-dp_16.jpg',

      validate(url) {
        if (!validator.isURL(url)) {
          throw new Error('Invalid photo URL ! ' + url);
        }
      },
    },
    about: {
      type: String,
      default: '',
    },
    skills: {
      type: [String],
    },
  },
  { timestamps: true }
);

userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, 'jwt secret secret key', {
    expiresIn: '15d',
  });

  return token;
};

const User = mongoose.model('User', userSchema);

export default User;
