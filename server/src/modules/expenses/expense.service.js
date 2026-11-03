const Expense = require('./expense.model');
const MinHeap = require('../../utils/minHeap');
const TripMember = require('../trips/tripMember.model');

const createExpense = async (tripId, paidBy, { amount, category, description, splitType, participantIds }) => {
  const numericAmount = Number(amount);
  if (!Number.isFinite(numericAmount) || numericAmount <= 0 || numericAmount > 100000000) {
    const error = new Error('Expense amount must be a positive valid number');
    error.statusCode = 400;
    throw error;
  }

  const members = await TripMember.find({ trip: tripId }).select('user').lean();
  const memberIds = new Set(members.map((member) => member.user.toString()));
  const participants = Array.isArray(participantIds)
    ? participantIds
    : [];
  if (participants.length === 0 || participants.some((participant) => !memberIds.has((participant.user || participant).toString()))) {
    const error = new Error('All expense participants must be members of this trip');
    error.statusCode = 400;
    throw error;
  }

  let splitBetween;

  if (splitType === 'EQUAL') {
    const shareAmount = Math.floor((numericAmount / participants.length) * 100) / 100;
    const remainder = Math.round((numericAmount - shareAmount * participants.length) * 100) / 100;
    splitBetween = participants.map((userId, index) => ({ user: userId, share: index === participants.length - 1 ? shareAmount + remainder : shareAmount }));
  } else if (splitType === 'CUSTOM') {
    splitBetween = participants.map((participant) => ({ user: participant.user, share: Number(participant.share) }));
    const totalShares = splitBetween.reduce((sum, participant) => sum + participant.share, 0);
    if (splitBetween.some((participant) => !Number.isFinite(participant.share) || participant.share < 0) || Math.abs(totalShares - numericAmount) > 0.01) {
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
    amount: numericAmount,
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
