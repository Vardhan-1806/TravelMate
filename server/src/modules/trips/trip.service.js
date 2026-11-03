const Trip = require('./trip.model');
const TripMember = require('./tripMember.model');

const ALLOWED_SORTS = new Set(['createdAt', 'startDate', 'endDate', 'budgetPerPerson', 'destination']);

const escapeRegex = (value) => String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const parsePositiveInteger = (value, fallback, max) => {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed < 1) return fallback;
  return Math.min(parsed, max);
};

const createTrip = async (creatorId, tripData) => {
  const allowedFields = [
    'title', 'source', 'destination', 'startDate', 'endDate', 'budgetPerPerson',
    'maxMembers', 'description', 'tripType', 'transport', 'accommodation',
    'meetingPoint', 'requirements', 'visibility',
  ];
  const safeTripData = Object.fromEntries(
    allowedFields.filter((field) => tripData[field] !== undefined).map((field) => [field, tripData[field]])
  );

  const trip = await Trip.create({
    ...safeTripData,
    creator: creatorId,
    currentMembers: 1,
  });

  await TripMember.create({
    trip: trip._id,
    user: creatorId,
    role: 'TRIP_ADMIN',
  });

  return trip;
};

const getTripById = async (tripId) => {
  if (!tripId || !require('mongoose').isValidObjectId(tripId)) {
    const error = new Error('Trip not found');
    error.statusCode = 404;
    throw error;
  }

  const trip = await Trip.findById(tripId).populate('creator', 'name email profile.city');
  if (!trip) {
    const error = new Error('Trip not found');
    error.statusCode = 404;
    throw error;
  }
  return trip;
};

const discoverTrips = async (filters) => {
  const {
    destination,
    source,
    minBudget,
    maxBudget,
    startDate,
    endDate,
    transport,
    accommodation,
    hasAvailableSeats,
    sortBy = 'createdAt',
    order = 'desc',
    page = 1,
    limit = 10,
  } = filters;

  const query = { status: 'OPEN', visibility: 'PUBLIC' };

  if (destination) {
    query.destination = { $regex: escapeRegex(destination.trim()).slice(0, 80), $options: 'i' };
  }
  if (source) {
    query.source = { $regex: escapeRegex(source.trim()).slice(0, 80), $options: 'i' };
  }
  if (transport) {
    query.transport = transport;
  }
  if (accommodation) {
    query.accommodation = accommodation;
  }
  const parsedMinBudget = Number(minBudget);
  const parsedMaxBudget = Number(maxBudget);
  if (Number.isFinite(parsedMinBudget) || Number.isFinite(parsedMaxBudget)) {
    query.budgetPerPerson = {};
    if (Number.isFinite(parsedMinBudget) && parsedMinBudget >= 0) query.budgetPerPerson.$gte = parsedMinBudget;
    if (Number.isFinite(parsedMaxBudget) && parsedMaxBudget >= 0) query.budgetPerPerson.$lte = parsedMaxBudget;
  }
  if (startDate || endDate) {
    if (startDate && !Number.isNaN(new Date(startDate).getTime())) query.endDate = { $gte: new Date(startDate) };
    if (endDate && !Number.isNaN(new Date(endDate).getTime())) query.startDate = { $lte: new Date(endDate) };
  }
  if (hasAvailableSeats === 'true') {
    query.$expr = { $lt: ['$currentMembers', '$maxMembers'] };
  }

  const safePage = parsePositiveInteger(page, 1, 100000);
  const safeLimit = parsePositiveInteger(limit, 12, 50);
  const skip = (safePage - 1) * safeLimit;
  const sortOrder = order === 'asc' ? 1 : -1;
  const safeSortBy = ALLOWED_SORTS.has(sortBy) ? sortBy : 'createdAt';

  const [trips, total] = await Promise.all([
    Trip.find(query)
      .populate('creator', 'name profile.city')
      .sort({ [safeSortBy]: sortOrder })
      .skip(skip)
      .limit(safeLimit),
    Trip.countDocuments(query),
  ]);

  return {
    trips,
    pagination: {
      total,
       page: safePage,
       limit: safeLimit,
       totalPages: Math.ceil(total / safeLimit),
    },
  };
};

const completeTrip = async (tripId, userId) => {
  const trip = await Trip.findById(tripId);
  if (!trip) {
    const error = new Error('Trip not found');
    error.statusCode = 404;
    throw error;
  }
  if (trip.creator.toString() !== userId) {
    const error = new Error('Only the trip creator can mark it complete');
    error.statusCode = 403;
    throw error;
  }
  trip.status = 'COMPLETED';
  await trip.save();
  return trip;
};

module.exports = { createTrip, getTripById, discoverTrips, completeTrip };
