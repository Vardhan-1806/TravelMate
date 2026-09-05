const mongoose = require('mongoose');

const itineraryItemSchema = new mongoose.Schema(
  {
    trip: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    date: { type: Date, required: true },
    time: { type: String, default: '' },
    location: { type: String, default: '' },
    description: { type: String, maxlength: 500, default: '' },
    estimatedCost: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
);

itineraryItemSchema.index({ trip: 1, date: 1 });

module.exports = mongoose.model('ItineraryItem', itineraryItemSchema);