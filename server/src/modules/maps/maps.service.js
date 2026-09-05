const axios = require('axios');

const geocodeDestination = async (placeName) => {
  const response = await axios.get('https://nominatim.openstreetmap.org/search', {
    params: { q: placeName, format: 'json', limit: 1 },
    headers: { 'User-Agent': 'TravelMate-App/1.0 (student project)' },
  });

  if (!response.data || response.data.length === 0) {
    const error = new Error('Location not found');
    error.statusCode = 404;
    throw error;
  }

  const result = response.data[0];
  return {
    name: result.display_name,
    latitude: parseFloat(result.lat),
    longitude: parseFloat(result.lon),
  };
};

const findNearbyPlaces = async (latitude, longitude, category = 'restaurant', radiusMeters = 2000) => {
  const categoryMap = {
    restaurant: 'amenity=restaurant',
    hospital: 'amenity=hospital',
    atm: 'amenity=atm',
    pharmacy: 'amenity=pharmacy',
    fuel: 'amenity=fuel',
  };

  const tag = categoryMap[category];
  if (!tag) {
    const error = new Error('Invalid category');
    error.statusCode = 400;
    throw error;
  }

  const query = `
    [out:json][timeout:15];
    node[${tag}](around:${radiusMeters},${latitude},${longitude});
    out body 20;
  `;

 const response = await axios.post(
  'https://overpass-api.de/api/interpreter',
  `data=${encodeURIComponent(query)}`,
  { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
);

  return response.data.elements.map((place) => ({
    name: place.tags?.name || 'Unnamed location',
    latitude: place.lat,
    longitude: place.lon,
  }));
};

module.exports = { geocodeDestination, findNearbyPlaces };