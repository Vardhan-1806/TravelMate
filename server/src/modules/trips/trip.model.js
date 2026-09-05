const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    source: { type: String, required: true, trim: true },
    destination: { type: String, required: true, trim: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },

    budgetPerPerson: { type: Number, required: true, min: 0 },
    maxMembers: { type: Number, required: true, min: 1 },
    currentMembers: { type: Number, default: 1 },

    description: { type: String, maxlength: 1000, default: '' },

    tripType: [{
      type: String,
      enum: ['Backpacker', 'Budget', 'Luxury', 'Adventure', 'Relaxed', 'Photography', 'Nature', 'Trekking', 'Cultural', 'Food', 'Road Trip', 'Solo'],
    }],
    transport: { type: String, enum: ['Train', 'Bus', 'Flight', 'Car', 'Any'], default: 'Any' },
    accommodation: { type: String, enum: ['Hostel', 'Hotel', 'Resort', 'Camping', 'Not decided'], default: 'Not decided' },

    meetingPoint: { type: String, default: '' },
    requirements: { type: String, default: '' },

    visibility: { type: String, enum: ['PUBLIC', 'PRIVATE'], default: 'PUBLIC' },
    status: { type: String, enum: ['OPEN', 'FULL', 'COMPLETED', 'CANCELLED'], default: 'OPEN' },
  },
  { timestamps: true }
);

tripSchema.index({ destination: 1, startDate: 1 });
tripSchema.index({ status: 1, visibility: 1 });

module.exports = mongoose.model('Trip', tripSchema);