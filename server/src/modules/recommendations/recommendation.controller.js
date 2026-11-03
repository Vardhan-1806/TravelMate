const { getPersonalizedRecommendations, recordInteraction } = require('./recommendation.service');

const getRecommendations = async (req, res) => {
  try {
    const result = await getPersonalizedRecommendations(req.user.id, req.query.limit);
    res.status(200).json(result);
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message || 'Server error' });
  }
};

const interact = async (req, res) => {
  try {
    const interaction = await recordInteraction(req.user.id, req.params.tripId, req.body.type);
    res.status(201).json({ interaction });
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message || 'Server error' });
  }
};

module.exports = { getRecommendations, interact };
