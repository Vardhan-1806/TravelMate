const ItineraryItem = require('./itineraryItem.model');
const TripMember = require('../trips/tripMember.model');

const createItem = async (tripId, userId, itemData) => {
  if (typeof itemData.title !== 'string' || !itemData.title.trim() || !itemData.date) {
    const error = new Error('Activity title and date are required');
    error.statusCode = 400;
    throw error;
  }

  const item = await ItineraryItem.create({
    title: itemData.title.trim().slice(0, 120),
    date: itemData.date,
    time: typeof itemData.time === 'string' ? itemData.time.trim().slice(0, 30) : '',
    location: typeof itemData.location === 'string' ? itemData.location.trim().slice(0, 120) : '',
    description: typeof itemData.description === 'string' ? itemData.description.trim().slice(0, 500) : '',
    estimatedCost: Math.max(0, Number(itemData.estimatedCost) || 0),
    trip: tripId,
    createdBy: userId,
  });
  return item;
};

const getItemsForTrip = async (tripId) => {
  const items = await ItineraryItem.find({ trip: tripId })
    .populate('createdBy', 'name')
    .sort({ date: 1, createdAt: 1 });
  return items;
};

const canUserModify = async (item, userId) => {
  if (item.createdBy.toString() === userId) return true;
  const membership = await TripMember.findOne({ trip: item.trip, user: userId });
  return membership?.role === 'TRIP_ADMIN';
};

const updateItem = async (itemId, userId, updates) => {
  const item = await ItineraryItem.findById(itemId);
  if (!item) {
    const error = new Error('Itinerary item not found');
    error.statusCode = 404;
    throw error;
  }

  const canEdit = await canUserModify(item, userId);
  if (!canEdit) {
    const error = new Error('You do not have permission to edit this item');
    error.statusCode = 403;
    throw error;
  }

  const allowedFields = ['title', 'date', 'time', 'location', 'description', 'estimatedCost'];
  for (const field of allowedFields) {
    if (updates[field] !== undefined) {
      item[field] = updates[field];
    }
  }

  await item.save();
  return item;
};

const deleteItem = async (itemId, userId) => {
  const item = await ItineraryItem.findById(itemId);
  if (!item) {
    const error = new Error('Itinerary item not found');
    error.statusCode = 404;
    throw error;
  }

  const canDelete = await canUserModify(item, userId);
  if (!canDelete) {
    const error = new Error('You do not have permission to delete this item');
    error.statusCode = 403;
    throw error;
  }

  await item.deleteOne();
  return { deleted: true };
};

module.exports = { createItem, getItemsForTrip, updateItem, deleteItem };
