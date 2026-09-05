const mongoose = require('mongoose');

const communityPostSchema = new mongoose.Schema(
  {
    community: { type: mongoose.Schema.Types.ObjectId, ref: 'Community', required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true, maxlength: 2000 },
  },
  { timestamps: true }
);

communityPostSchema.index({ community: 1, createdAt: -1 });

module.exports = mongoose.model('CommunityPost', communityPostSchema);