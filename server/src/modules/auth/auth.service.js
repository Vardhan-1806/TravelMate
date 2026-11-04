const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('./user.model');

const RESET_TOKEN_TTL_MS = 15 * 60 * 1000;

const registerUser = async ({ name, email, password }) => {
   if (typeof name !== 'string' || typeof email !== 'string' || typeof password !== 'string') {
     const error = new Error('Invalid input');
     error.statusCode = 400;
     throw error;
   }
   const normalizedName = name.trim();
   const normalizedEmail = email.trim().toLowerCase();

   if (normalizedName.length < 2 || normalizedName.length > 80 || password.length < 8 || password.length > 128) {
     const error = new Error('Please provide a valid name and a password between 8 and 128 characters');
     error.statusCode = 400;
     throw error;
   }

   const existingUser = await User.findOne({ email: normalizedEmail });
  if (existingUser) {
    const error = new Error('Email already registered');
    error.statusCode = 409;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
     name: normalizedName,
     email: normalizedEmail,
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
   const user = await User.findOne({ email: email.trim().toLowerCase() });
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

const refreshUserSession = async (refreshToken) => {
  if (typeof refreshToken !== 'string' || !refreshToken) {
    const error = new Error('Refresh token missing');
    error.statusCode = 401;
    throw error;
  }

  let decoded;
  try {
    decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
  } catch {
    const error = new Error('Invalid refresh token');
    error.statusCode = 401;
    throw error;
  }

  const user = await User.findById(decoded.id).select('_id name email role isSuspended');
  if (!user || user.isSuspended) {
    const error = new Error('Invalid refresh token');
    error.statusCode = 401;
    throw error;
  }

  const tokens = generateTokens(user);
  return {
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
    ...tokens,
  };
};

const createPasswordReset = async (email) => {
  const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
  const user = await User.findOne({ email: normalizedEmail }).select('+resetPasswordToken +resetPasswordExpires');
  if (!user) return null;

  const rawToken = crypto.randomBytes(32).toString('hex');
  user.resetPasswordToken = crypto.createHash('sha256').update(rawToken).digest('hex');
  user.resetPasswordExpires = new Date(Date.now() + RESET_TOKEN_TTL_MS);
  await user.save();
  return { user, rawToken };
};

const resetPassword = async ({ token, password }) => {
  if (typeof token !== 'string' || !token || typeof password !== 'string' || password.length < 8 || password.length > 128) {
    const error = new Error('Please provide a valid reset link and a password between 8 and 128 characters');
    error.statusCode = 400;
    throw error;
  }

  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  const user = await User.findOne({ resetPasswordToken: hashedToken, resetPasswordExpires: { $gt: new Date() } }).select('+resetPasswordToken +resetPasswordExpires');
  if (!user) {
    const error = new Error('This password reset link is invalid or has expired');
    error.statusCode = 400;
    throw error;
  }

  user.password = await bcrypt.hash(password, 10);
  user.resetPasswordToken = null;
  user.resetPasswordExpires = null;
  await user.save();
};

module.exports = { registerUser, loginUser, refreshUserSession, createPasswordReset, resetPassword };
