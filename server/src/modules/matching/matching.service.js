const User = require('../auth/user.model');
const Trip = require('../trips/trip.model');
const TripMember = require('../trips/tripMember.model');
const MinHeap = require('../../utils/minHeap');

const normalizeTag = (value) => {
  const normalized = String(value).trim().toLowerCase();
  const aliases = {
    beaches: 'beach',
    beach: 'beach',
    mountains: 'mountain',
    mountain: 'mountain',
    food: 'food',
    trekking: 'trekking',
    adventure: 'adventure',
    photography: 'photography',
    nature: 'nature',
  };
  return aliases[normalized] || normalized;
};

const calculateOverlap = (arrA = [], arrB = []) => {
  if (arrA.length === 0 || arrB.length === 0) return 0;
  const setB = new Set(arrB.map(normalizeTag));
  const intersection = arrA.map(normalizeTag).filter((item) => setB.has(item));
  return intersection.length / Math.max(arrA.length, arrB.length);
};

const calculateDateScore = (user, trip) => {
  const preferences = user.travelPreferences || {};
  if (!preferences.dateRange?.start || !preferences.dateRange?.end) return 0.5;
  const userStart = new Date(preferences.dateRange.start);
  const userEnd = new Date(preferences.dateRange.end);
  const overlapStart = Math.max(userStart.getTime(), new Date(trip.startDate).getTime());
  const overlapEnd = Math.min(userEnd.getTime(), new Date(trip.endDate).getTime());
  if (overlapEnd < overlapStart) return 0;
  const tripDuration = Math.max(new Date(trip.endDate).getTime() - new Date(trip.startDate).getTime(), 86400000);
  return Math.min((overlapEnd - overlapStart) / tripDuration, 1);
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
  const interestScore = calculateOverlap(prefs.interests, trip.tripType);
  const transportScore = calculateTransportScore(prefs.transportPreference, trip.transport);
  const dateScore = calculateDateScore(user, trip);

  const weights = { destination: 0.2, budget: 0.2, style: 0.18, interests: 0.2, transport: 0.12, dates: 0.1 };

  const totalScore =
    destinationScore * weights.destination +
    budgetScore * weights.budget +
    styleScore * weights.style +
    interestScore * weights.interests +
    transportScore * weights.transport +
    dateScore * weights.dates;

  const percentage = Math.round(totalScore * 100);

  const reasons = [];
  if (budgetScore >= 0.8) reasons.push('Similar budget');
  if (styleScore >= 0.5) reasons.push('Shared travel style');
  if (interestScore >= 0.25) reasons.push('Overlapping interests');
  if (transportScore === 1) reasons.push('Matching transport preference');
  if (dateScore >= 0.8) reasons.push('Dates line up well');

  return {
    tripId: trip._id,
    trip: {
      _id: trip._id,
      title: trip.title,
      source: trip.source,
      destination: trip.destination,
      startDate: trip.startDate,
      endDate: trip.endDate,
      budgetPerPerson: trip.budgetPerPerson,
      currentMembers: trip.currentMembers,
      maxMembers: trip.maxMembers,
      transport: trip.transport,
      accommodation: trip.accommodation,
      tripType: trip.tripType,
    },
    compatibility: percentage,
    breakdown: {
      destination: Math.round(destinationScore * 100),
      budget: Math.round(budgetScore * 100),
      travelStyle: Math.round(styleScore * 100),
      interests: Math.round(interestScore * 100),
      transport: Math.round(transportScore * 100),
      dates: Math.round(dateScore * 100),
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

  const memberships = await TripMember.find({ user: userId }).select('trip');
  const joinedTripIds = memberships.map((membership) => membership.trip);
  const trips = await Trip.find({
    status: 'OPEN',
    visibility: 'PUBLIC',
    creator: { $ne: userId },
    $expr: { $lt: ['$currentMembers', '$maxMembers'] },
    _id: { $nin: joinedTripIds },
  }).populate('creator', 'name profile.city');
  const k = Math.max(1, Math.min(Number(limit) || 10, 50));

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
