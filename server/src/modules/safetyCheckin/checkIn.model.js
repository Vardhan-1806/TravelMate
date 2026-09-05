const mongoose = require('mongoose');

const checkInSchema = new mongoose.Schema(
  {
    trip: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    scheduledFor: { type: Date, required: true },
    checkedInAt: { type: Date, default: null },
    status: { type: String, enum: ['PENDING', 'CONFIRMED', 'MISSED'], default: 'PENDING' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('CheckIn', checkInSchema);