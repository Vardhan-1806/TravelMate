const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    trip: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', required: true },
    reviewer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    reviewee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    ratings: {
      reliability: { type: Number, required: true, min: 1, max: 5 },
      communication: { type: Number, required: true, min: 1, max: 5 },
      cooperation: { type: Number, required: true, min: 1, max: 5 },
      respect: { type: Number, required: true, min: 1, max: 5 },
    },
    comment: { type: String, maxlength: 500, default: '' },
  },
  { timestamps: true }
);

reviewSchema.index({ trip: 1, reviewer: 1, reviewee: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);