const { geocodeDestination, findNearbyPlaces } = require('./maps.service');

const geocode = async (req, res) => {
  try {
    if (typeof req.query.place !== 'string' || req.query.place.trim().length < 2 || req.query.place.length > 120) {
      return res.status(400).json({ message: 'A valid place is required' });
    }
    const result = await geocodeDestination(req.query.place);
    res.status(200).json(result);
  } catch (err) {
    if (err.response) {
      return res.status(502).json({ message: 'Map service unavailable, please try again' });
    }
    res.status(err.statusCode || 500).json({ message: err.message || 'Server error' });
  }
};

const nearby = async (req, res) => {
  try {
    const { lat, lon, category, radius } = req.query;
    if (!lat || !lon) {
      return res.status(400).json({ message: 'Latitude and longitude are required' });
    }
    const places = await findNearbyPlaces(parseFloat(lat), parseFloat(lon), category, parseFloat(radius));
    res.status(200).json({ places });
  } catch (err) {
  if (err.response) {
    return res.status(502).json({ message: 'Map service unavailable, please try again' });
  }
  res.status(err.statusCode || 500).json({ message: err.message || 'Server error' });
}
};

module.exports = { geocode, nearby };
