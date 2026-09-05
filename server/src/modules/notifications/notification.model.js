const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: {
      type: String,
      enum: ['JOIN_REQUEST_RECEIVED', 'JOIN_REQUEST_ACCEPTED', 'JOIN_REQUEST_REJECTED', 'NEW_POLL', 'NEW_REVIEW', 'CHECKIN_MISSED'],
      required: true,
    },
    message: { type: String, required: true },
    relatedTrip: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip' },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

notificationSchema.index({ user: 1, isRead: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);