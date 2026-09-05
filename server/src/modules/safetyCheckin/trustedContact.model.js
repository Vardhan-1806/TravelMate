const mongoose = require('mongoose');

const trustedContactSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    contactName: { type: String, required: true },
    contactPhone: { type: String, required: true },
    contactEmail: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('TrustedContact', trustedContactSchema);