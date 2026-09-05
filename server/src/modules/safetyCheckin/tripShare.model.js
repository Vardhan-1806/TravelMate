const mongoose = require('mongoose');

const tripShareSchema = new mongoose.Schema(
  {
    trip: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    trustedContact: { type: mongoose.Schema.Types.ObjectId, ref: 'TrustedContact', required: true },
  },
  { timestamps: true }
);

tripShareSchema.index({ trip: 1, trustedContact: 1 }, { unique: true });

module.exports = mongoose.model('TripShare', tripShareSchema);