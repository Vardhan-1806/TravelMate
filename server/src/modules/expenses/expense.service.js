const Expense = require('./expense.model');
const MinHeap = require('../../utils/minHeap');

const createExpense = async (tripId, paidBy, { amount, category, description, splitType, participantIds }) => {
  let splitBetween;

  if (splitType === 'EQUAL') {
    const shareAmount = Math.round((amount / participantIds.length) * 100) / 100;
    splitBetween = participantIds.map((userId) => ({ user: userId, share: shareAmount }));
  } else if (splitType === 'CUSTOM') {
    splitBetween = participantIds;
    const totalShares = splitBetween.reduce((sum, p) => sum + p.share, 0);
    if (Math.abs(totalShares - amount) > 0.01) {
      const error = new Error('Custom split shares must add up to the total amount');
      error.statusCode = 400;
      throw error;
    }
  } else {
    const error = new Error('splitType must be EQUAL or CUSTOM');
    error.statusCode = 400;
    throw error;
  }

  const expense = await Expense.create({
    trip: tripId,
    paidBy,
    amount,
    category,
    description,
    splitBetween,
  });

  return expense;
};

const calculateSettlement = async (tripId) => {
  const expenses = await Expense.find({ trip: tripId });

  const balances = {};

  for (const expense of expenses) {
    const payerId = expense.paidBy.toString();
    balances[payerId] = (balances[payerId] || 0) + expense.amount;

    for (const participant of expense.splitBetween) {
      const userId = participant.user.toString();
      balances[userId] = (balances[userId] || 0) - participant.share;
    }
  }

  const creditors = new MinHeap((a, b) => b.amount - a.amount);
  const debtors = new MinHeap((a, b) => b.amount - a.amount);

  for (const [userId, balance] of Object.entries(balances)) {
    const rounded = Math.round(balance * 100) / 100;
    if (rounded > 0.01) creditors.push({ userId, amount: rounded });
    else if (rounded < -0.01) debtors.push({ userId, amount: -rounded });
  }

  const transactions = [];

  while (creditors.size() > 0 && debtors.size() > 0) {
    const topCreditor = creditors.pop();
    const topDebtor = debtors.pop();

    const settleAmount = Math.min(topCreditor.amount, topDebtor.amount);

    transactions.push({
      from: topDebtor.userId,
      to: topCreditor.userId,
      amount: Math.round(settleAmount * 100) / 100,
    });

    const creditorRemaining = Math.round((topCreditor.amount - settleAmount) * 100) / 100;
    const debtorRemaining = Math.round((topDebtor.amount - settleAmount) * 100) / 100;

    if (creditorRemaining > 0.01) creditors.push({ userId: topCreditor.userId, amount: creditorRemaining });
    if (debtorRemaining > 0.01) debtors.push({ userId: topDebtor.userId, amount: debtorRemaining });
  }

  return { balances, transactions };
};
module.exports = {createExpense,calculateSettlement};