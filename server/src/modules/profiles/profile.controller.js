const { getProfile, updateProfile } = require('./profile.service');

const getMe = async (req, res) => {
  try {
    const user = await getProfile(req.user.id);
    res.status(200).json({ user });
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message || 'Server error' });
  }
};

const updateMe = async (req, res) => {
  try {
    const user = await updateProfile(req.user.id, req.body);
    res.status(200).json({ message: 'Profile updated', user });
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message || 'Server error' });
  }
};

module.exports = { getMe, updateMe };