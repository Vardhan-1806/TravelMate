const User = require('../auth/user.model');
const Trip = require('../trips/trip.model');
const MinHeap = require('../../utils/minHeap');

const calculateOverlap = (arrA = [], arrB = []) => {
  if (arrA.length === 0 || arrB.length === 0) return 0;
  const setB = new Set(arrB);
  const intersection = arrA.filter((item) => setB.has(item));
  return intersection.length / Math.max(arrA.length, arrB.length);
};

const calculateBudgetScore = (userBudget, tripBudget) => {
  if (!userBudget || (userBudget.min === 0 && userBudget.max === 0)) return 0.5;
  if (tripBudget >= userBudget.min && tripBudget <= userBudget.max) return 1;

  const nearestBound = tripBudget < userBudget.min ? userBudget.min : userBudget.max;
  const distance = Math.abs(tripBudget - nearestBound);
  const range = userBudget.max - userBudget.min || 1;
  const score = 1 - Math.min(distance / range, 1);
  return Math.max(score, 0);
};

const calculateTransportScore = (userTransport, tripTransport) => {
  if (userTransport === 'Any' || tripTransport === 'Any') return 1;
  return userTransport === tripTransport ? 1 : 0;
};

const calculateCompatibility = (user, trip) => {
  const prefs = user.travelPreferences || {};

  const destinationScore = 1;
  const budgetScore = calculateBudgetScore(prefs.budgetRange, trip.budgetPerPerson);
  const styleScore = calculateOverlap(prefs.travelStyle, trip.tripType);
  const transportScore = calculateTransportScore(prefs.transportPreference, trip.transport);

  const weights = { destination: 0.43, budget: 0.29, style: 0.21, transport: 0.14 };

  const totalScore =
    destinationScore * weights.destination +
    budgetScore * weights.budget +
    styleScore * weights.style +
    transportScore * weights.transport;

  const percentage = Math.round(totalScore * 100);

  const reasons = [];
  if (budgetScore >= 0.8) reasons.push('Similar budget');
  if (styleScore >= 0.5) reasons.push('Shared travel style');
  if (transportScore === 1) reasons.push('Matching transport preference');

  return {
    tripId: trip._id,
    compatibility: percentage,
    breakdown: {
      destination: Math.round(destinationScore * 100),
      budget: Math.round(budgetScore * 100),
      travelStyle: Math.round(styleScore * 100),
      transport: Math.round(transportScore * 100),
    },
    reasons,
  };
};

const getMatchesForUser = async (userId, limit = 10) => {
  const user = await User.findById(userId);
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  const trips = await Trip.find({ status: 'OPEN', visibility: 'PUBLIC' });
  const k = Number(limit);

  const heap = new MinHeap((a, b) => a.compatibility - b.compatibility);

  for (const trip of trips) {
    const scoredTrip = calculateCompatibility(user, trip);
    if (heap.size() < k) {
      heap.push(scoredTrip);
    } else if (scoredTrip.compatibility > heap.peek().compatibility) {
      heap.pop();
      heap.push(scoredTrip);
    }
  }

  const result = [];
  while (heap.size() > 0) {
    result.push(heap.pop());
  }
  result.reverse();

  return result;
};

module.exports = { calculateCompatibility, getMatchesForUser, calculateOverlap };