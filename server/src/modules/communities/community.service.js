const Community = require('./community.model');
const CommunityMember = require('./communityMember.model');
const CommunityPost = require('./communityPost.model');

const createCommunity = async (userId, { name, description, category }) => {
  const community = await Community.create({ name, description, category, createdBy: userId, memberCount: 1 });
  await CommunityMember.create({ community: community._id, user: userId });
  return community;
};

const joinCommunity = async (userId, communityId) => {
  try {
    await CommunityMember.create({ community: communityId, user: userId });
  } catch (err) {
    if (err.code === 11000) {
      const error = new Error('Already a member of this community');
      error.statusCode = 409;
      throw error;
    }
    throw err;
  }

  await Community.findByIdAndUpdate(communityId, { $inc: { memberCount: 1 } });
  return { joined: true };
};

const createPost = async (userId, communityId, content) => {
  const isMember = await CommunityMember.findOne({ community: communityId, user: userId });
  if (!isMember) {
    const error = new Error('You must join this community to post');
    error.statusCode = 403;
    throw error;
  }
  return CommunityPost.create({ community: communityId, author: userId, content });
};

const getCommunityPosts = async (communityId, page = 1, limit = 20) => {
  const skip = (Number(page) - 1) * Number(limit);
  const [posts, total] = await Promise.all([
    CommunityPost.find({ community: communityId })
      .populate('author', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    CommunityPost.countDocuments({ community: communityId }),
  ]);
  return { posts, pagination: { total, page: Number(page), totalPages: Math.ceil(total / Number(limit)) } };
};

const discoverCommunities = async (category) => {
  const query = category ? { category } : {};
  return Community.find(query).sort({ memberCount: -1 });
};

module.exports = { createCommunity, joinCommunity, createPost, getCommunityPosts, discoverCommunities };