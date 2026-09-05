const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema(
  {
    reporter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    reportedUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    reportedTrip: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip' },
    reason: { type: String, required: true, maxlength: 500 },
    status: { type: String, enum: ['PENDING', 'REVIEWED', 'DISMISSED'], default: 'PENDING' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Report', reportSchema);