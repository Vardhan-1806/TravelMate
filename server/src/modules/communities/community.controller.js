const { createCommunity, joinCommunity, createPost, getCommunityPosts, discoverCommunities } = require('./community.service');

const create = async (req, res) => {
  try {
    const community = await createCommunity(req.user.id, req.body);
    res.status(201).json({ community });
  } catch (err) {
    res.status(err.statusCode || (err.code === 11000 ? 409 : 500)).json({ message: err.message || 'Server error' });
  }
};

const join = async (req, res) => {
  try {
    const result = await joinCommunity(req.user.id, req.params.communityId);
    res.status(200).json(result);
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message || 'Server error' });
  }
};

const post = async (req, res) => {
  try {
    const newPost = await createPost(req.user.id, req.params.communityId, req.body.content);
    res.status(201).json({ post: newPost });
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message || 'Server error' });
  }
};

const getPosts = async (req, res) => {
  try {
    const result = await getCommunityPosts(req.params.communityId, req.query.page, req.query.limit);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const discover = async (req, res) => {
  try {
    const communities = await discoverCommunities(req.query.category);
    res.status(200).json({ communities });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { create, join, post, getPosts, discover };