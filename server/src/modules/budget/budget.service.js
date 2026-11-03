const Budget = require('./budget.model');

const CATEGORY_NAMES = ['transport', 'accommodation', 'food', 'activities', 'emergency', 'miscellaneous'];

const upsertBudget = async (tripId, userId, categories) => {
  const sanitizedCategories = {};
  for (const category of CATEGORY_NAMES) {
    const values = categories?.[category] || {};
    const estimated = Number(values.estimated) || 0;
    const actual = Number(values.actual) || 0;
    if (estimated < 0 || actual < 0 || estimated > 100000000 || actual > 100000000) {
      const error = new Error('Budget values must be positive and realistic');
      error.statusCode = 400;
      throw error;
    }
    sanitizedCategories[category] = { estimated, actual };
  }

  const budget = await Budget.findOneAndUpdate(
    { trip: tripId, user: userId },
    { $set: { categories: sanitizedCategories } },
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
