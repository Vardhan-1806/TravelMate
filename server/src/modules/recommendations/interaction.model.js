const mongoose = require('mongoose');

const interactionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    trip: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', required: true },
    type: { type: String, enum: ['VIEW', 'SAVE', 'JOIN_REQUESTED'], required: true },
  },
  { timestamps: true }
);

interactionSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('RecommendationInteraction', interactionSchema);