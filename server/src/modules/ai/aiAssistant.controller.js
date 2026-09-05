const { askAssistant } = require('./aiAssistant.service');

const ask = async (req, res) => {
  try {
    const result = await askAssistant(req.params.tripId, req.user.id, req.body.question);
    res.status(200).json(result);
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message || 'AI service error' });
  }
};

module.exports = { ask };
