const TripMember = require('./tripMember.model');
const Trip = require('./trip.model');

const getWorkspaceOverview = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.tripId);
    const members = await TripMember.find({ trip: req.params.tripId }).populate('user', 'name email profile.city');

    res.status(200).json({ trip, members, yourRole: req.tripMember.role });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getWorkspaceOverview};