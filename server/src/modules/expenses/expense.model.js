const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema(
  {
    trip: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', required: true },
    paidBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true, min: 0 },
    category: {
      type: String,
      enum: ['Hotel', 'Food', 'Fuel', 'Tickets', 'Activities', 'Transport', 'Shopping', 'Miscellaneous'],
      required: true,
    },
    description: { type: String, default: '', trim: true },
    splitBetween: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        share: { type: Number, required: true, min: 0 },
      },
    ],
  },
  { timestamps: true }
);

expenseSchema.index({ trip: 1, createdAt: -1 });

module.exports = mongoose.model('Expense', expenseSchema);