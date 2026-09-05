const PreparationItem = require('./preparationItem.model');
const Trip = require('../trips/trip.model');
const { generateChecklist } = require('./checklistRules');

const generateForTrip = async (tripId, userId) => {
  const existing = await PreparationItem.findOne({ trip: tripId, user: userId });
  if (existing) {
    const error = new Error('Checklist already generated for this trip. Use GET to view it.');
    error.statusCode = 409;
    throw error;
  }

  const trip = await Trip.findById(tripId);
  if (!trip) {
    const error = new Error('Trip not found');
    error.statusCode = 404;
    throw error;
  }

  const durationDays = Math.ceil((trip.endDate - trip.startDate) / (1000 * 60 * 60 * 24));

  const ruleItems = generateChecklist({
    tripType: trip.tripType,
    transport: trip.transport,
    durationDays,
  });

  const documents = ruleItems.map((entry) => ({
    trip: tripId,
    user: userId,
    category: entry.category,
    item: entry.item,
    isCustom: false,
  }));

  return PreparationItem.insertMany(documents);
};

const getChecklist = async (tripId, userId) => {
  return PreparationItem.find({ trip: tripId, user: userId }).sort({ category: 1 });
};

const togglePacked = async (itemId, userId) => {
  const item = await PreparationItem.findOne({ _id: itemId, user: userId });
  if (!item) {
    const error = new Error('Item not found');
    error.statusCode = 404;
    throw error;
  }
  item.isPacked = !item.isPacked;
  await item.save();
  return item;
};

const addCustomItem = async (tripId, userId, { category, item }) => {
  return PreparationItem.create({ trip: tripId, user: userId, category, item, isCustom: true });
};

const removeItem = async (itemId, userId) => {
  const result = await PreparationItem.findOneAndDelete({ _id: itemId, user: userId });
  if (!result) {
    const error = new Error('Item not found');
    error.statusCode = 404;
    throw error;
  }
  return { deleted: true };
};

module.exports = { generateForTrip, getChecklist, togglePacked, addCustomItem, removeItem };