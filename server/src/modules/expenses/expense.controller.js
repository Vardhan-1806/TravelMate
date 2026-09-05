const { createExpense, calculateSettlement } = require('./expense.service');

const create = async (req, res) => {
  try {
    const expense = await createExpense(req.params.tripId, req.user.id, req.body);
    res.status(201).json({ message: 'Expense recorded', expense });
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message || 'Server error' });
  }
};

const settlement = async (req, res) => {
  try {
    const result = await calculateSettlement(req.params.tripId);
    res.status(200).json(result);
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message || 'Server error' });
  }
};

module.exports = { create, settlement };