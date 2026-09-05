const { calculateReadiness } = require('./readiness.service');

const getReadiness = async (req, res) => {
  try {
    const result = await calculateReadiness(req.params.tripId, req.user.id);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getReadiness };