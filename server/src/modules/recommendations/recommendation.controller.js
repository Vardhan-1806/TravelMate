const { getPersonalizedRecommendations } = require('./recommendation.service');

const getRecommendations = async (req, res) => {
  try {
    const result = await getPersonalizedRecommendations(req.user.id, req.query.limit);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getRecommendations };