import api from './axios';

export const fetchMyProfile = async () => {
  const res = await api.get('/profile/me');
  return res.data.user;
};

export const updateMyProfile = async (updates) => {
  const res = await api.patch('/profile/me', updates);
  return res.data.user;
};
