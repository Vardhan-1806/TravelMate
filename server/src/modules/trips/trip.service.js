const Trip = require('./trip.model');
const TripMember = require('./tripMember.model');

const createTrip = async (creatorId, tripData) => {
  const trip = await Trip.create({
    ...tripData,
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
    query.destination = { $regex: destination, $options: 'i' };
  }
  if (source) {
    query.source = { $regex: source, $options: 'i' };
  }
  if (transport) {
    query.transport = transport;
  }
  if (accommodation) {
    query.accommodation = accommodation;
  }
  if (minBudget || maxBudget) {
    query.budgetPerPerson = {};
    if (minBudget) query.budgetPerPerson.$gte = Number(minBudget);
    if (maxBudget) query.budgetPerPerson.$lte = Number(maxBudget);
  }
  if (startDate || endDate) {
    query.startDate = {};
    if (startDate) query.startDate.$gte = new Date(startDate);
    if (endDate) query.startDate.$lte = new Date(endDate);
  }
  if (hasAvailableSeats === 'true') {
    query.$expr = { $lt: ['$currentMembers', '$maxMembers'] };
  }

  const skip = (Number(page) - 1) * Number(limit);
  const sortOrder = order === 'asc' ? 1 : -1;

  const [trips, total] = await Promise.all([
    Trip.find(query)
      .populate('creator', 'name profile.city')
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(Number(limit)),
    Trip.countDocuments(query),
  ]);

  return {
    trips,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
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