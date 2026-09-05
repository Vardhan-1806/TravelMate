const mongoose = require('mongoose');

const memorySchema = new mongoose.Schema(
  {
    trip: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', required: true, unique: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    caption: { type: String, maxlength: 1000, default: '' },
    photos: [{ type: String }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Memory', memorySchema);