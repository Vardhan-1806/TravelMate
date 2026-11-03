const RecommendationInteraction = require('./interaction.model');
const Trip = require('../trips/trip.model');
const TripMember = require('../trips/tripMember.model');

const getInferredInterests = async (userId) => {
  const interactions = await RecommendationInteraction.find({ user: userId })
    .sort({ createdAt: -1 })
    .limit(50)
    .populate('trip', 'tripType destination');

  const weights = { VIEW: 1, SAVE: 2, JOIN_REQUESTED: 3 };
  const typeScores = {};

  interactions.forEach((interaction) => {
    if (!interaction.trip) return;
    interaction.trip.tripType.forEach((type) => {
      typeScores[type] = (typeScores[type] || 0) + weights[interaction.type];
    });
  });

  return Object.entries(typeScores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([type]) => type);
};

const getPersonalizedRecommendations = async (userId, limit = 10) => {
  const inferredInterests = await getInferredInterests(userId);
  const safeLimit = Math.max(1, Math.min(Number(limit) || 10, 24));
  const memberships = await TripMember.find({ user: userId }).select('trip').lean();

  const query = {
    status: 'OPEN',
    visibility: 'PUBLIC',
    creator: { $ne: userId },
    _id: { $nin: memberships.map((membership) => membership.trip) },
    $expr: { $lt: ['$currentMembers', '$maxMembers'] },
  };
  if (inferredInterests.length > 0) {
    query.tripType = { $in: inferredInterests };
  }

  const trips = await Trip.find(query).sort({ createdAt: -1 }).limit(safeLimit).populate('creator', 'name profile.city');

  return {
    trips: trips.map((trip) => ({
      ...trip.toObject(),
      recommendationReason: inferredInterests.length > 0
        ? `Matches your interest in ${inferredInterests.slice(0, 2).join(' and ')}`
        : 'A fresh open trip from the TravelMate community',
    })),
    inferredInterests,
  };
};

const recordInteraction = async (userId, tripId, type) => {
  if (!['VIEW', 'SAVE', 'JOIN_REQUESTED'].includes(type)) {
    const error = new Error('Invalid recommendation interaction');
    error.statusCode = 400;
    throw error;
  }
  return RecommendationInteraction.create({ user: userId, trip: tripId, type });
};

module.exports = { getPersonalizedRecommendations, recordInteraction };
