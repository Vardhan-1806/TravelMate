const Poll = require('./poll.model');
const PollVote = require('./pollVote.model');
const TripMember = require('../trips/tripMember.model');

const ensurePollMember = async (tripId, userId) => {
  const member = await TripMember.findOne({ trip: tripId, user: userId });
  if (!member) {
    const error = new Error('You are not a member of this trip');
    error.statusCode = 403;
    throw error;
  }
};

const createPoll = async (tripId, userId, { question, options }) => {
  await ensurePollMember(tripId, userId);
  const cleanOptions = Array.isArray(options)
    ? [...new Set(options.filter((option) => typeof option === 'string').map((option) => option.trim()).filter(Boolean))]
    : [];
  if (typeof question !== 'string' || question.trim().length < 3 || question.length > 240 || cleanOptions.length < 2 || cleanOptions.length > 8) {
    const error = new Error('A poll needs at least 2 options');
    error.statusCode = 400;
    throw error;
  }
  const poll = await Poll.create({ trip: tripId, createdBy: userId, question: question.trim(), options: cleanOptions });
  return poll;
};

const castVote = async (pollId, userId, selectedOption) => {
  const poll = await Poll.findById(pollId);
  if (!poll) {
    const error = new Error('Poll not found');
    error.statusCode = 404;
    throw error;
  }
  await ensurePollMember(poll.trip, userId);
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

const getPollResults = async (pollId, userId) => {
  const poll = await Poll.findById(pollId);
  if (!poll) {
    const error = new Error('Poll not found');
    error.statusCode = 404;
    throw error;
  }
  await ensurePollMember(poll.trip, userId);

  const votes = await PollVote.find({ poll: pollId });

  const tally = {};
  poll.options.forEach((opt) => { tally[opt] = 0; });
  votes.forEach((vote) => {
    tally[vote.selectedOption] = (tally[vote.selectedOption] || 0) + 1;
  });

  return { poll, tally, totalVotes: votes.length };
};

const getPollsForTrip = async (tripId, userId) => {
  await ensurePollMember(tripId, userId);
  const polls = await Poll.find({ trip: tripId }).sort({ createdAt: -1 }).lean();
  const results = await Promise.all(polls.map(async (poll) => {
    const votes = await PollVote.find({ poll: poll._id }).select('user selectedOption').lean();
    const tally = Object.fromEntries(poll.options.map((option) => [option, 0]));
    let myVote = null;
    votes.forEach((vote) => {
      tally[vote.selectedOption] = (tally[vote.selectedOption] || 0) + 1;
      if (vote.user.toString() === userId.toString()) myVote = vote.selectedOption;
    });
    return { ...poll, tally, totalVotes: votes.length, myVote };
  }));
  return results;
};

const closePoll = async (pollId, userId) => {
  const poll = await Poll.findById(pollId);
  if (!poll) {
    const error = new Error('Poll not found');
    error.statusCode = 404;
    throw error;
  }
  await ensurePollMember(poll.trip, userId);
  if (poll.createdBy.toString() !== userId) {
    const error = new Error('Only the poll creator can close it');
    error.statusCode = 403;
    throw error;
  }
  poll.status = 'CLOSED';
  await poll.save();
  return poll;
};

module.exports = { createPoll, castVote, getPollResults, getPollsForTrip, closePoll };
