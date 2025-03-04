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
      enum: {
        values: ['male', 'female', 'other'],
        message: `{VALUE} is not a valid gender type !`,
      },
      // validate(gender) {
      //   if (!['male', 'female', 'others'].includes(gender)) {
      //     throw new Error('Gender data is not valid !');
      //   }
      // },
    },
    photoUrl: {
      type: String,
      default:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/340px-Default_pfp.svg.png',

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
  const token = await jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
    expiresIn: '15d',
  });

  return token;
};

const User = mongoose.model('User', userSchema);

export default User;
