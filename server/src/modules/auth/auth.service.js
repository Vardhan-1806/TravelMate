const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('./user.model');

const registerUser = async ({ name, email, password }) => {
   if (typeof name !== 'string' || typeof email !== 'string' || typeof password !== 'string') {
    const error = new Error('Invalid input');
    error.statusCode = 400;
    throw error;
  }
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    const error = new Error('Email already registered');
    error.statusCode = 409;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  return {
    id: user._id,
    name: user.name,
    email: user.email,
  };
};
const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: '15m' }
  );

  const refreshToken = jwt.sign(
    { id: user._id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );

  return { accessToken, refreshToken };
};

const loginUser = async ({ email, password }) => {
  if (typeof email !== 'string' || typeof password !== 'string') {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }
  const user = await User.findOne({ email });
  if (!user) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }
  if (user.isSuspended) {
  const error = new Error('Your account has been suspended');
  error.statusCode = 403;
  throw error;
}

  const tokens = generateTokens(user);

  return {
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
    ...tokens,
  };
};

module.exports = { registerUser, loginUser };