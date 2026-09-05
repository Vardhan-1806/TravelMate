const { geocodeDestination, findNearbyPlaces } = require('./maps.service');

const geocode = async (req, res) => {
  try {
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
    const { lat, lon, category } = req.query;
    if (!lat || !lon) {
      return res.status(400).json({ message: 'Latitude and longitude are required' });
    }
    const places = await findNearbyPlaces(parseFloat(lat), parseFloat(lon), category);
    res.status(200).json({ places });
  } catch (err) {
  if (err.response) {
    return res.status(502).json({ message: 'Map service unavailable, please try again' });
  }
  res.status(err.statusCode || 500).json({ message: err.message || 'Server error' });
}
};

module.exports = { geocode, nearby };