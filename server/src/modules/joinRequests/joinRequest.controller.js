const { createJoinRequest, respondToJoinRequest } = require('./joinRequest.service');

const create = async (req, res) => {
  try {
    const joinRequest = await createJoinRequest(req.params.tripId, req.user.id, req.body.message);
    res.status(201).json({ message: 'Join request sent', joinRequest });
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message || 'Server error' });
  }
};

const respond = async (req, res) => {
  try {
    const { decision } = req.body;
    if (!['ACCEPTED', 'REJECTED'].includes(decision)) {
      return res.status(400).json({ message: 'Decision must be ACCEPTED or REJECTED' });
    }
    const joinRequest = await respondToJoinRequest(req.params.requestId, req.user.id, decision);
    res.status(200).json({ message: `Request ${decision.toLowerCase()}`, joinRequest });
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message || 'Server error' });
  }
};

module.exports = { create, respond };