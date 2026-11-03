const { createPoll, castVote, getPollResults, getPollsForTrip, closePoll } = require('./poll.service');

const create = async (req, res) => {
  try {
    const poll = await createPoll(req.params.tripId, req.user.id, req.body);
    res.status(201).json({ message: 'Poll created', poll });
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message || 'Server error' });
  }
};

const vote = async (req, res) => {
  try {
    const result = await castVote(req.params.pollId, req.user.id, req.body.selectedOption);
    res.status(201).json({ message: 'Vote recorded', vote: result });
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message || 'Server error' });
  }
};

const results = async (req, res) => {
  try {
    const result = await getPollResults(req.params.pollId, req.user.id);
    res.status(200).json(result);
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message || 'Server error' });
  }
};

const list = async (req, res) => {
  try {
    const polls = await getPollsForTrip(req.params.tripId, req.user.id);
    res.status(200).json({ polls });
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message || 'Server error' });
  }
};

const close = async (req, res) => {
  try {
    const poll = await closePoll(req.params.pollId, req.user.id);
    res.status(200).json({ message: 'Poll closed', poll });
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message || 'Server error' });
  }
};

module.exports = { create, vote, results, list, close };
