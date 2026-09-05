const Budget = require('./budget.model');

const upsertBudget = async (tripId, userId, categories) => {
  const budget = await Budget.findOneAndUpdate(
    { trip: tripId, user: userId },
    { $set: { categories } },
    { new: true, upsert: true, runValidators: true }
  );
  return budget;
};

const getBudgetSummary = async (tripId, userId) => {
  const budget = await Budget.findOne({ trip: tripId, user: userId });
  if (!budget) {
    const error = new Error('No budget found for this trip');
    error.statusCode = 404;
    throw error;
  }

  let totalEstimated = 0;
  let totalActual = 0;
  const breakdown = {};

  for (const [category, values] of Object.entries(budget.categories.toObject())) {
    totalEstimated += values.estimated;
    totalActual += values.actual;
    breakdown[category] = {
      ...values,
      difference: values.actual - values.estimated,
      overBudget: values.actual > values.estimated,
    };
  }

  const overallDifference = totalActual - totalEstimated;
  const percentOverBudget = totalEstimated > 0
    ? Math.round((overallDifference / totalEstimated) * 100)
    : 0;

  return {
    budget,
    totalEstimated,
    totalActual,
    overallDifference,
    percentOverBudget,
    isOverBudget: totalActual > totalEstimated,
    breakdown,
  };
};

module.exports = { upsertBudget, getBudgetSummary };