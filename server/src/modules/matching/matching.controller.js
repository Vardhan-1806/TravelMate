const { getMatchesForUser } = require('./matching.service');

const getMyMatches = async (req, res) => {
  try {
    const matches = await getMatchesForUser(req.user.id, req.query.limit);
    res.status(200).json({ matches });
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message || 'Server error' });
  }
};

module.exports = { getMyMatches };