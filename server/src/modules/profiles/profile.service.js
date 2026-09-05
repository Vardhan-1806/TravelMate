const User = require('../auth/user.model');

const getProfile = async (userId) => {
  const user = await User.findById(userId).select('-password');
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }
  return user;
};

const updateProfile = async (userId, updates) => {
  const allowedFields = ['profile', 'travelPreferences', 'name'];
  const sanitizedUpdates = {};

  for (const field of allowedFields) {
    if (updates[field] !== undefined) {
      sanitizedUpdates[field] = updates[field];
    }
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { $set: sanitizedUpdates },
    { returnDocument: 'after', runValidators: true }
  ).select('-password');

  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  return user;
};

module.exports = { getProfile, updateProfile };