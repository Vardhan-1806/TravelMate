import api from './axios';

// Overview & Members
export const fetchWorkspaceOverview = async (tripId) => {
  const res = await api.get(`/workspace/${tripId}/overview`);
  return res.data;
};

// Chat Message History
export const fetchChatHistory = async (tripId) => {
  const res = await api.get(`/messages/trips/${tripId}/history`);
  return res.data;
};

// Itinerary
export const fetchItinerary = async (tripId) => {
  const res = await api.get(`/itinerary/trips/${tripId}/items`);
  return res.data;
};

export const addItineraryItem = async (tripId, itemData) => {
  const res = await api.post(`/itinerary/trips/${tripId}/items`, itemData);
  return res.data;
};

// Polls
export const createPoll = async (tripId, pollData) => {
  const res = await api.post(`/polls/trips/${tripId}/polls`, pollData);
  return res.data;
};

export const votePoll = async (pollId, optionIndex) => {
  const res = await api.post(`/polls/${pollId}/vote`, { selectedOption: optionIndex });
  return res.data;
};

export const fetchPolls = async (tripId) => {
  const res = await api.get(`/polls/trips/${tripId}/polls`);
  return res.data;
};

export const fetchReadiness = async (tripId) => {
  const res = await api.get(`/readiness/trips/${tripId}`);
  return res.data;
};

export const fetchBudget = async (tripId) => {
  const res = await api.get(`/budget/trips/${tripId}`);
  return res.data;
};

export const saveBudget = async (tripId, categories) => {
  const res = await api.put(`/budget/trips/${tripId}`, { categories });
  return res.data;
};

export const addCustomPreparationItem = async (tripId, itemData) => {
  const res = await api.post(`/preparation/trips/${tripId}/items`, itemData);
  return res.data;
};

// Expenses & Settlement
export const addExpense = async (tripId, expenseData) => {
  const res = await api.post(`/expenses/trips/${tripId}`, expenseData);
  return res.data;
};

export const fetchSettlement = async (tripId) => {
  const res = await api.get(`/expenses/trips/${tripId}/settlement`);
  return res.data;
};

// Preparation Checklist
export const fetchPreparationList = async (tripId) => {
  const res = await api.get(`/preparation/trips/${tripId}`);
  return res.data;
};

export const generatePreparationList = async (tripId) => {
  const res = await api.post(`/preparation/trips/${tripId}/generate`);
  return res.data;
};

export const togglePreparationItem = async (itemId) => {
  const res = await api.patch(`/preparation/items/${itemId}/toggle`);
  return res.data;
};

// AI Assistant
export const askAiAssistant = async (tripId, question) => {
  const res = await api.post(`/ai/assistant/trips/${tripId}/ask`, { question });
  return res.data;
};
