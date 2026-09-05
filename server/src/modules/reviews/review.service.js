const Review = require('./review.model');
const Trip = require('../trips/trip.model');
const TripMember = require('../trips/tripMember.model');

const createReview = async (tripId, reviewerId, { revieweeId, ratings, comment }) => {
  if (reviewerId === revieweeId) {
    const error = new Error('You cannot review yourself');
    error.statusCode = 400;
    throw error;
  }

  const trip = await Trip.findById(tripId);
  if (!trip) {
    const error = new Error('Trip not found');
    error.statusCode = 404;
    throw error;
  }
  if (trip.status !== 'COMPLETED') {
    const error = new Error('You can only review after the trip is completed');
    error.statusCode = 400;
    throw error;
  }

  const [reviewerIsMember, revieweeIsMember] = await Promise.all([
    TripMember.findOne({ trip: tripId, user: reviewerId }),
    TripMember.findOne({ trip: tripId, user: revieweeId }),
  ]);

  if (!reviewerIsMember) {
    const error = new Error('You were not a member of this trip');
    error.statusCode = 403;
    throw error;
  }
  if (!revieweeIsMember) {
    const error = new Error('The person you are reviewing was not a member of this trip');
    error.statusCode = 400;
    throw error;
  }

  try {
    const review = await Review.create({
      trip: tripId,
      reviewer: reviewerId,
      reviewee: revieweeId,
      ratings,
      comment,
    });
    return review;
  } catch (err) {
    if (err.code === 11000) {
      const error = new Error('You have already reviewed this person for this trip');
      error.statusCode = 409;
      throw error;
    }
    throw err;
  }
};

const getUserReputation = async (userId) => {
  const reviews = await Review.find({ reviewee: userId });

  if (reviews.length === 0) {
    return { totalReviews: 0, averages: null };
  }

  const totals = { reliability: 0, communication: 0, cooperation: 0, respect: 0 };
  for (const review of reviews) {
    totals.reliability += review.ratings.reliability;
    totals.communication += review.ratings.communication;
    totals.cooperation += review.ratings.cooperation;
    totals.respect += review.ratings.respect;
  }

  const count = reviews.length;
  const averages = {
    reliability: Math.round((totals.reliability / count) * 10) / 10,
    communication: Math.round((totals.communication / count) * 10) / 10,
    cooperation: Math.round((totals.cooperation / count) * 10) / 10,
    respect: Math.round((totals.respect / count) * 10) / 10,
  };
  averages.overall = Math.round(
    ((averages.reliability + averages.communication + averages.cooperation + averages.respect) / 4) * 10
  ) / 10;

  return { totalReviews: count, averages };
};

module.exports = { createReview, getUserReputation };