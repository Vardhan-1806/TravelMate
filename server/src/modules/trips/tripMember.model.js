const mongoose = require('mongoose');

const tripMemberSchema = new mongoose.Schema(
  {
    trip: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    role: { type: String, enum: ['TRIP_ADMIN', 'MEMBER'], default: 'MEMBER' },
  },
  { timestamps: true }
);

tripMemberSchema.index({ trip: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('TripMember', tripMemberSchema);