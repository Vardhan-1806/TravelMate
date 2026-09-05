const TripMember = require('../trips/tripMember.model');
const JoinRequest = require('./joinRequest.model');
const Trip = require('../trips/trip.model');
const { createNotification } = require('../notifications/notification.service');
const { isBlockedEitherWay } = require('../safety/safety.service');
const RecommendationInteraction = require('../recommendations/interaction.model');

const createJoinRequest = async (tripId, userId, message) => {
  const trip = await Trip.findById(tripId);
  if (!trip) {
    const error = new Error('Trip not found');
    error.statusCode = 404;
    throw error;
  }

  if (trip.creator.toString() === userId) {
    const error = new Error('You cannot request to join your own trip');
    error.statusCode = 400;
    throw error;
  }

  if (trip.status !== 'OPEN') {
    const error = new Error('This trip is not open for join requests');
    error.statusCode = 400;
    throw error;
  }

  const blocked = await isBlockedEitherWay(userId, trip.creator.toString());
  if (blocked) {
    const error = new Error('Unable to send join request');
    error.statusCode = 403;
    throw error;
  }

  try {
    const joinRequest = await JoinRequest.create({ trip: tripId, user: userId, message });

    RecommendationInteraction.create({ user: userId, trip: tripId, type: 'JOIN_REQUESTED' }).catch(() => {});

    await createNotification({
      userId: trip.creator,
      type: 'JOIN_REQUEST_RECEIVED',
      message: `Someone requested to join your trip "${trip.title}"`,
      relatedTrip: trip._id,
    });

    return joinRequest;
  } catch (err) {
    if (err.code === 11000) {
      const error = new Error('You have already requested to join this trip');
      error.statusCode = 409;
      throw error;
    }
    throw err;
  }
};

const respondToJoinRequest = async (requestId, tripAdminId, decision) => {
  const joinRequest = await JoinRequest.findById(requestId).populate('trip');

  if (!joinRequest) {
    const error = new Error('Join request not found');
    error.statusCode = 404;
    throw error;
  }

  if (joinRequest.trip.creator.toString() !== tripAdminId) {
    const error = new Error('Only the trip creator can respond to join requests');
    error.statusCode = 403;
    throw error;
  }

  if (joinRequest.status !== 'PENDING') {
    const error = new Error('This request has already been responded to');
    error.statusCode = 400;
    throw error;
  }

  if (decision === 'ACCEPTED') {
    const updatedTrip = await Trip.findOneAndUpdate(
      { _id: joinRequest.trip._id, $expr: { $lt: ['$currentMembers', '$maxMembers'] } },
      { $inc: { currentMembers: 1 } },
      { new: true }
    );

    if (!updatedTrip) {
      const error = new Error('Trip is already full');
      error.statusCode = 409;
      throw error;
    }

    if (updatedTrip.currentMembers >= updatedTrip.maxMembers) {
      updatedTrip.status = 'FULL';
      await updatedTrip.save();
    }

    await TripMember.create({
      trip: joinRequest.trip._id,
      user: joinRequest.user,
      role: 'MEMBER',
    });
  }

  joinRequest.status = decision;
  await joinRequest.save();
  await joinRequest.populate('trip', 'title creator currentMembers maxMembers');

  await createNotification({
    userId: joinRequest.user,
    type: decision === 'ACCEPTED' ? 'JOIN_REQUEST_ACCEPTED' : 'JOIN_REQUEST_REJECTED',
    message: `Your request to join "${joinRequest.trip.title}" was ${decision.toLowerCase()}`,
    relatedTrip: joinRequest.trip._id,
  });

  return joinRequest;
};

module.exports = { createJoinRequest, respondToJoinRequest };