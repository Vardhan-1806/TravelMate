const { createReview, getUserReputation } = require('./review.service');

const create = async (req, res) => {
  try {
    const review = await createReview(req.params.tripId, req.user.id, req.body);
    res.status(201).json({ message: 'Review submitted', review });
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message || 'Server error' });
  }
};

const getReputation = async (req, res) => {
  try {
    const reputation = await getUserReputation(req.params.userId);
    res.status(200).json(reputation);
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message || 'Server error' });
  }
};

module.exports = { create, getReputation };