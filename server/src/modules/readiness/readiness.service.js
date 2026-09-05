const PreparationItem = require('../preparation/preparationItem.model');
const Budget = require('../budget/budget.model');
const ItineraryItem = require('../itinerary/itineraryItem.model');

const calculateReadiness = async (tripId, userId) => {
  const [prepItems, budget, itineraryCount] = await Promise.all([
    PreparationItem.find({ trip: tripId, user: userId }),
    Budget.findOne({ trip: tripId, user: userId }),
    ItineraryItem.countDocuments({ trip: tripId }),
  ]);

  const packingScore = prepItems.length > 0
    ? Math.round((prepItems.filter((i) => i.isPacked).length / prepItems.length) * 100)
    : 0;

  const budgetScore = budget ? 100 : 0;
  const itineraryScore = itineraryCount > 0 ? 100 : 0;

  const overall = Math.round(
    packingScore * 0.4 + budgetScore * 0.3 + itineraryScore * 0.3
  );

  const pending = [];
  if (packingScore < 100) pending.push(`${prepItems.filter((i) => !i.isPacked).length} items left to pack`);
  if (!budget) pending.push('Budget not set');
  if (itineraryCount === 0) pending.push('No itinerary planned yet');

  return {
    overall,
    breakdown: { packing: packingScore, budget: budgetScore, itinerary: itineraryScore },
    pending,
  };
};

module.exports = { calculateReadiness };