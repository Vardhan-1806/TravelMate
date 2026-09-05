const Report = require('./report.model');
const Block = require('./block.model');

const createReport = async (reporterId, { reportedUserId, reportedTripId, reason }) => {
  if (!reportedUserId && !reportedTripId) {
    const error = new Error('A report must target either a user or a trip');
    error.statusCode = 400;
    throw error;
  }
  if (reportedUserId && reportedTripId) {
    const error = new Error('A report cannot target both a user and a trip at once');
    error.statusCode = 400;
    throw error;
  }

  const report = await Report.create({
    reporter: reporterId,
    reportedUser: reportedUserId,
    reportedTrip: reportedTripId,
    reason,
  });
  return report;
};

const blockUser = async (blockerId, blockedId) => {
  if (blockerId === blockedId) {
    const error = new Error('You cannot block yourself');
    error.statusCode = 400;
    throw error;
  }

  try {
    const block = await Block.create({ blocker: blockerId, blocked: blockedId });
    return block;
  } catch (err) {
    if (err.code === 11000) {
      const error = new Error('You have already blocked this user');
      error.statusCode = 409;
      throw error;
    }
    throw err;
  }
};

const unblockUser = async (blockerId, blockedId) => {
  const result = await Block.findOneAndDelete({ blocker: blockerId, blocked: blockedId });
  if (!result) {
    const error = new Error('Block relationship not found');
    error.statusCode = 404;
    throw error;
  }
  return { unblocked: true };
};

const isBlockedEitherWay = async (userA, userB) => {
  const block = await Block.findOne({
    $or: [
      { blocker: userA, blocked: userB },
      { blocker: userB, blocked: userA },
    ],
  });
  return !!block;
};

module.exports = { createReport, blockUser, unblockUser, isBlockedEitherWay };