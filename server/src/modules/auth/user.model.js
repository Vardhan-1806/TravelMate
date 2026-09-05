const mongoose = require('mongoose');
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    role: { type: String, enum: ['USER', 'ADMIN'], default: 'USER' },
    isSuspended: { type: Boolean, default: false },

    profile: {
      bio: { type: String, maxlength: 300, default: '' },
      city: { type: String, default: '' },
      languages: [{ type: String }],
      profilePhoto: { type: String, default: '' },
    },

    travelPreferences: {
      travelStyle: [{
        type: String,
        enum: ['Backpacker', 'Budget', 'Luxury', 'Adventure', 'Relaxed', 'Photography', 'Nature', 'Trekking', 'Cultural', 'Food', 'Road Trip', 'Solo'],
      }],
      interests: [{
        type: String,
        enum: ['Beaches', 'Mountains', 'Trekking', 'Photography', 'Food', 'Nightlife', 'History', 'Wildlife', 'Shopping', 'Camping', 'Adventure'],
      }],
      budgetRange: {
        min: { type: Number, default: 0 },
        max: { type: Number, default: 0 },
      },
      transportPreference: { type: String, enum: ['Train', 'Bus', 'Flight', 'Car', 'Any'], default: 'Any' },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);