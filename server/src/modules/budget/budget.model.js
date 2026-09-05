const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema(
  {
    trip: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    categories: {
      transport: { estimated: { type: Number, default: 0 }, actual: { type: Number, default: 0 } },
      accommodation: { estimated: { type: Number, default: 0 }, actual: { type: Number, default: 0 } },
      food: { estimated: { type: Number, default: 0 }, actual: { type: Number, default: 0 } },
      activities: { estimated: { type: Number, default: 0 }, actual: { type: Number, default: 0 } },
      emergency: { estimated: { type: Number, default: 0 }, actual: { type: Number, default: 0 } },
      miscellaneous: { estimated: { type: Number, default: 0 }, actual: { type: Number, default: 0 } },
    },
  },
  { timestamps: true }
);

budgetSchema.index({ trip: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('Budget', budgetSchema);