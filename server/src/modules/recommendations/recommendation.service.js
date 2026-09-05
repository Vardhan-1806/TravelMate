const RecommendationInteraction = require('./interaction.model');
const Trip = require('../trips/trip.model');

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

  const query = { status: 'OPEN', visibility: 'PUBLIC' };
  if (inferredInterests.length > 0) {
    query.tripType = { $in: inferredInterests };
  }

  const trips = await Trip.find(query).limit(Number(limit)).populate('creator', 'name');

  return { trips, inferredInterests };
};

module.exports = { getPersonalizedRecommendations };