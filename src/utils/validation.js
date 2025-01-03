import validator from 'validator';

export const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;

  if (firstName === '') {
    throw new Error('First name cannot be null !');
  }
  if (lastName === '') {
    throw new Error('Last name cannot be null !');
  }
  if (emailId === '') {
    throw new Error('Email Id cannot be null !');
  }
  if (password === '') {
    throw new Error('Password cannot be null !');
  }

  // Validate first name (should not contain numbers or special characters)
  if (!validator.isAlpha(firstName, 'en-US', { ignore: ' ' })) {
    throw new Error('First name should only contain letters !');
  }

  // Validate last name (should not contain numbers or special characters)
  if (!validator.isAlpha(lastName, 'en-US', { ignore: ' ' })) {
    throw new Error('Last name should only contain letters !');
  }

  // Validate email ID
  if (!validator.isEmail(emailId)) {
    throw new Error('Invalid email address !');
  }

  // Validate password (minimum 8 characters, at least 1 letter and 1 number)
  if (
    !validator.isStrongPassword(password, {
      minLength: 6,
      minLowercase: 1,
      minUppercase: 0,
      minNumbers: 1,
      minSymbols: 0,
    })
  ) {
    throw new Error(
      'Password must be at least 6 characters long and contain at least one letter and one number.'
    );
  }
};
