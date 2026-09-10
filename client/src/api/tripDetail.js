import api from './axios';

export const fetchTripById = async (tripId) => {
  const res = await api.get(`/trips/${tripId}`);
  return res.data.trip;
};

export const fetchMyMatches = async () => {
  const res = await api.get('/matching');
  return res.data.matches;
};

export const requestToJoin = async (tripId, message) => {
  const res = await api.post(`/join-requests/trips/${tripId}/join`, { message });
  return res.data;
};