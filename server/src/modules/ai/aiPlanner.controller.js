const { generateTripPlan } = require('./aiPlanner.service');

const plan = async (req, res) => {
  try {
    const result = await generateTripPlan(req.body);
    res.status(200).json(result);
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message || 'AI service error' });
  }
};

module.exports = { plan };