import api from './axios';

export const generateTripPlan = async (payload) => {
  const res = await api.post('/ai/plan', payload);
  return res.data;
};
