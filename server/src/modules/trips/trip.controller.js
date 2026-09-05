const { createTrip, getTripById, discoverTrips, completeTrip } = require('./trip.service');
const RecommendationInteraction = require('../recommendations/interaction.model');

const create = async (req, res) => {
  try {
    const trip = await createTrip(req.user.id, req.body);
    res.status(201).json({ message: 'Trip created successfully', trip });
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message || 'Server error' });
  }
};

const getOne = async (req, res) => {
  try {
    const trip = await getTripById(req.params.id);
    if (req.user) {
      RecommendationInteraction.create({ user: req.user.id, trip: trip._id, type: 'VIEW' }).catch(() => {});
    }
    res.status(200).json({ trip });
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message || 'Server error' });
  }
};

const discover = async (req, res) => {
  try {
    const result = await discoverTrips(req.query);
    res.status(200).json(result);
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message || 'Server error' });
  }
};

const complete = async (req, res) => {
  try {
    const trip = await completeTrip(req.params.id, req.user.id);
    res.status(200).json({ message: 'Trip marked as completed', trip });
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message || 'Server error' });
  }
};

module.exports = { create, getOne, discover, complete };