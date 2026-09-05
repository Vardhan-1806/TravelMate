const TripMember = require('../modules/trips/tripMember.model');

const requireTripMembership = async (req, res, next) => {
  try {
    const tripId = req.params.tripId || req.params.id;
    const member = await TripMember.findOne({ trip: tripId, user: req.user.id });

    if (!member) {
      return res.status(403).json({ message: 'You are not a member of this trip' });
    }

    req.tripMember = member;
    next();
  } catch (err) {
    res.status(500).json({ message: 'Server error checking trip membership' });
  }
};

const requireTripAdmin = (req, res, next) => {
  if (!req.tripMember || req.tripMember.role !== 'TRIP_ADMIN') {
    return res.status(403).json({ message: 'Only the trip admin can perform this action' });
  }
  next();
};

module.exports = { requireTripMembership, requireTripAdmin };