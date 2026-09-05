const { getMyNotifications, markAsRead } = require('./notification.service');

const getAll = async (req, res) => {
  try {
    const notifications = await getMyNotifications(req.user.id, req.query.unreadOnly);
    res.status(200).json({ notifications });
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message || 'Server error' });
  }
};

const read = async (req, res) => {
  try {
    const notification = await markAsRead(req.params.id, req.user.id);
    res.status(200).json({ message: 'Marked as read', notification });
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message || 'Server error' });
  }
};

module.exports = { getAll, read };