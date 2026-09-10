import api from './axios';

export const fetchTrips = async (filters) => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== '' && value !== undefined && value !== null) {
      params.append(key, value);
    }
  });
  const res = await api.get(`/trips?${params.toString()}`);
  return res.data;
};