const { upsertBudget, getBudgetSummary } = require('./budget.service');

const setBudget = async (req, res) => {
  try {
    const budget = await upsertBudget(req.params.tripId, req.user.id, req.body.categories);
    res.status(200).json({ message: 'Budget saved', budget });
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message || 'Server error' });
  }
};

const getSummary = async (req, res) => {
  try {
    const summary = await getBudgetSummary(req.params.tripId, req.user.id);
    res.status(200).json(summary);
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message || 'Server error' });
  }
};

module.exports = { setBudget, getSummary };