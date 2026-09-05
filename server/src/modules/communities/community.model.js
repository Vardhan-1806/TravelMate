const mongoose = require('mongoose');

const communitySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    description: { type: String, maxlength: 500, default: '' },
    category: {
      type: String,
      enum: ['Students', 'Backpackers', 'Trekkers', 'Bikers', 'Photographers', 'Solo Travelers', 'Weekend Travelers', 'Adventure Travelers'],
      required: true,
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    memberCount: { type: Number, default: 1 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Community', communitySchema);