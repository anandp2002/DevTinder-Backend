import { validateEditProfileData } from '../utils/validation.js';
import User from '../models/User.js';
import bcrypt from 'bcrypt';
import validator from 'validator';

export const view = async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    return res.status(400).send(`ERROR : ${err.message}`);
  }
};

export const edit = async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      throw new Error('Invalid edit request !');
    }
    const loggedInUser = req.user;
    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
    await loggedInUser.save();
    res
      .status(200)
      .json({ message: 'Profile updated successfully !', data: loggedInUser });
  } catch (err) {
    res.status(400).send('ERROR : ' + err.message);
  }
};

export const password = async (req, res) => {
  try {
    const { oldPassword, newPassword, confirmPassword } = req.body;

    if (!oldPassword || !newPassword || !confirmPassword) {
      return res.status(400).send('All fields are required.');
    }

    if (newPassword !== confirmPassword) {
      return res
        .status(400)
        .send('New password and confirm password do not match.');
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).send('User not found.');
    }

    const isOldPasswordCorrect = await bcrypt.compare(
      oldPassword,
      user.password
    );
    if (!isOldPasswordCorrect) {
      return res.status(400).send('Old password is incorrect.');
    }

    if (
      !validator.isStrongPassword(newPassword, {
        minLength: 6,
        minLowercase: 1,
        minUppercase: 0,
        minNumbers: 1,
        minSymbols: 0,
      })
    ) {
      return res
        .status(404)
        .send(
          'New password must be at least 6 characters long and contain at least one letter and one number !'
        );
    }

    if (oldPassword === newPassword) {
      return res.status(400).send('Old and new password must be different !');
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the password in the database
    user.password = hashedPassword;
    await user.save();

    res.status(200).send('Password updated successfully.');
  } catch (err) {
    console.error('Error updating password:', err);
    res.status(500).send('Internal server error.');
  }
};
