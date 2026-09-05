const Notification = require('./notification.model');

const createNotification = async ({ userId, type, message, relatedTrip }) => {
  return Notification.create({ user: userId, type, message, relatedTrip });
};

const getMyNotifications = async (userId, unreadOnly = false) => {
  const query = { user: userId };
  if (unreadOnly === 'true') query.isRead = false;

  return Notification.find(query).sort({ createdAt: -1 }).limit(50);
};

const markAsRead = async (notificationId, userId) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: notificationId, user: userId },
    { $set: { isRead: true } },
    { new: true }
  );
  if (!notification) {
    const error = new Error('Notification not found');
    error.statusCode = 404;
    throw error;
  }
  return notification;
};

module.exports = { createNotification, getMyNotifications, markAsRead };