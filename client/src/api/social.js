import api from './axios';

export const fetchReputation = async (userId) => {
  const res = await api.get(`/reviews/users/${userId}/reputation`);
  return res.data;
};

export const submitReview = async (tripId, review) => {
  const res = await api.post(`/reviews/trips/${tripId}`, review);
  return res.data;
};

export const reportUserOrTrip = async (payload) => {
  const res = await api.post('/safety/report', payload);
  return res.data;
};

export const blockUser = async (userId) => {
  const res = await api.post(`/safety/block/${userId}`);
  return res.data;
};

export const unblockUser = async (userId) => {
  const res = await api.delete(`/safety/block/${userId}`);
  return res.data;
};

export const fetchAdminStats = async () => {
  const res = await api.get('/admin/stats');
  return res.data;
};

export const fetchAdminReports = async (status) => {
  const res = await api.get('/admin/reports', { params: status ? { status } : {} });
  return res.data.reports;
};

export const updateReport = async (reportId, status) => {
  const res = await api.patch(`/admin/reports/${reportId}`, { status });
  return res.data;
};

export const updateSuspension = async (userId, suspend) => {
  const res = await api.patch(`/admin/users/${userId}/suspend`, { suspend });
  return res.data;
};
