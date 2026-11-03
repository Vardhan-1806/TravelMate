import api from './axios';

export const fetchMyProfile = async () => {
  const res = await api.get('/profile/me');
  return res.data.user;
};

export const fetchNotifications = async () => {
  const res = await api.get('/notifications');
  return res.data.notifications;
};

export const respondToJoinRequest = async (requestId, decision) => {
  const res = await api.patch(`/join-requests/${requestId}/respond`, { decision });
  return res.data;
};

export const fetchJoinRequests = async (tripId) => {
  const res = await api.get(`/join-requests/trips/${tripId}`);
  return res.data.joinRequests;
};

export const markNotificationRead = async (notificationId) => {
  const res = await api.patch(`/notifications/${notificationId}/read`);
  return res.data;
};
