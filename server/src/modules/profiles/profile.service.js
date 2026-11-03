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
  const sanitizedUpdates = {};

  if (typeof updates.name === 'string') {
    const name = updates.name.trim();
    if (name.length < 2 || name.length > 80) {
      const error = new Error('Name must be between 2 and 80 characters');
      error.statusCode = 400;
      throw error;
    }
    sanitizedUpdates.name = name;
  }

  if (updates.profile && typeof updates.profile === 'object' && !Array.isArray(updates.profile)) {
    const profile = {};
    if (typeof updates.profile.bio === 'string') profile.bio = updates.profile.bio.trim().slice(0, 300);
    if (typeof updates.profile.city === 'string') profile.city = updates.profile.city.trim().slice(0, 80);
    if (Array.isArray(updates.profile.languages)) {
      profile.languages = updates.profile.languages
        .filter((language) => typeof language === 'string')
        .map((language) => language.trim().slice(0, 30))
        .filter(Boolean)
        .slice(0, 8);
    }
    sanitizedUpdates.profile = profile;
  }

  if (updates.travelPreferences && typeof updates.travelPreferences === 'object' && !Array.isArray(updates.travelPreferences)) {
    const preferences = updates.travelPreferences;
    const allowedStyles = ['Backpacker', 'Budget', 'Luxury', 'Adventure', 'Relaxed', 'Photography', 'Nature', 'Trekking', 'Cultural', 'Food', 'Road Trip', 'Solo'];
    const allowedInterests = ['Beaches', 'Mountains', 'Trekking', 'Photography', 'Food', 'Nightlife', 'History', 'Wildlife', 'Shopping', 'Camping', 'Adventure'];
    const allowedTransport = ['Train', 'Bus', 'Flight', 'Car', 'Any'];

    sanitizedUpdates.travelPreferences = {
      travelStyle: Array.isArray(preferences.travelStyle)
        ? preferences.travelStyle.filter((item) => allowedStyles.includes(item)).slice(0, 8)
        : [],
      interests: Array.isArray(preferences.interests)
        ? preferences.interests.filter((item) => allowedInterests.includes(item)).slice(0, 12)
        : [],
      transportPreference: allowedTransport.includes(preferences.transportPreference)
        ? preferences.transportPreference
        : 'Any',
    };

    if (preferences.budgetRange && typeof preferences.budgetRange === 'object') {
      const min = Number(preferences.budgetRange.min);
      const max = Number(preferences.budgetRange.max);
      if (!Number.isFinite(min) || !Number.isFinite(max) || min < 0 || max < min || max > 10000000) {
        const error = new Error('Please provide a valid budget range');
        error.statusCode = 400;
        throw error;
      }
      sanitizedUpdates.travelPreferences.budgetRange = { min, max };
    }
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { $set: sanitizedUpdates },
    { new: true, runValidators: true }
  ).select('-password');

  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  return user;
};

module.exports = { getProfile, updateProfile };
