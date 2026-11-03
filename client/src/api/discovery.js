import api from './axios';

export const fetchRecommendations = async () => {
  const res = await api.get('/recommendations');
  return res.data;
};

export const recordRecommendationInteraction = async (tripId, type = 'SAVE') => {
  const res = await api.post(`/recommendations/${tripId}/interactions`, { type });
  return res.data;
};

export const geocodePlace = async (place) => {
  const res = await api.get('/maps/geocode', { params: { place } });
  return res.data;
};

export const fetchNearbyPlaces = async ({ latitude, longitude, category, radius }) => {
  const res = await api.get('/maps/nearby', { params: { lat: latitude, lon: longitude, category, radius } });
  return res.data.places;
};
