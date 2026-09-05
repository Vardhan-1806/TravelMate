const mongoose = require('mongoose');

const preparationItemSchema = new mongoose.Schema(
  {
    trip: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    category: { type: String, required: true },
    item: { type: String, required: true },
    isPacked: { type: Boolean, default: false },
    isCustom: { type: Boolean, default: false },
  },
  { timestamps: true }
);

preparationItemSchema.index({ trip: 1, user: 1 });

module.exports = mongoose.model('PreparationItem', preparationItemSchema);