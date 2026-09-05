const Poll = require('./poll.model');
const PollVote = require('./pollVote.model');

const createPoll = async (tripId, userId, { question, options }) => {
  if (!options || options.length < 2) {
    const error = new Error('A poll needs at least 2 options');
    error.statusCode = 400;
    throw error;
  }
  const poll = await Poll.create({ trip: tripId, createdBy: userId, question, options });
  return poll;
};

const castVote = async (pollId, userId, selectedOption) => {
  const poll = await Poll.findById(pollId);
  if (!poll) {
    const error = new Error('Poll not found');
    error.statusCode = 404;
    throw error;
  }
  if (poll.status !== 'OPEN') {
    const error = new Error('This poll is closed');
    error.statusCode = 400;
    throw error;
  }
  if (!poll.options.includes(selectedOption)) {
    const error = new Error('Invalid option selected');
    error.statusCode = 400;
    throw error;
  }

  try {
    const vote = await PollVote.create({ poll: pollId, user: userId, selectedOption });
    return vote;
  } catch (err) {
    if (err.code === 11000) {
      const error = new Error('You have already voted on this poll');
      error.statusCode = 409;
      throw error;
    }
    throw err;
  }
};

const getPollResults = async (pollId) => {
  const poll = await Poll.findById(pollId);
  if (!poll) {
    const error = new Error('Poll not found');
    error.statusCode = 404;
    throw error;
  }

  const votes = await PollVote.find({ poll: pollId });

  const tally = {};
  poll.options.forEach((opt) => { tally[opt] = 0; });
  votes.forEach((vote) => {
    tally[vote.selectedOption] = (tally[vote.selectedOption] || 0) + 1;
  });

  return { poll, tally, totalVotes: votes.length };
};

const closePoll = async (pollId, userId) => {
  const poll = await Poll.findById(pollId);
  if (!poll) {
    const error = new Error('Poll not found');
    error.statusCode = 404;
    throw error;
  }
  if (poll.createdBy.toString() !== userId) {
    const error = new Error('Only the poll creator can close it');
    error.statusCode = 403;
    throw error;
  }
  poll.status = 'CLOSED';
  await poll.save();
  return poll;
};

module.exports = { createPoll, castVote, getPollResults, closePoll };