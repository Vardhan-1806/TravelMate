const { connectTestDB, closeTestDB, clearTestDB } = require('./setup');
const mongoose = require('mongoose');
const Expense = require('../src/modules/expenses/expense.model');
const { calculateSettlement } = require('../src/modules/expenses/expense.service');

describe('Greedy Settlement Algorithm', () => {
  beforeAll(async () => await connectTestDB());
  afterAll(async () => await closeTestDB());
  afterEach(async () => await clearTestDB());

  const tripId = new mongoose.Types.ObjectId();
  const userA = new mongoose.Types.ObjectId();
  const userB = new mongoose.Types.ObjectId();
  const userC = new mongoose.Types.ObjectId();

  test('simple two-person equal split produces exactly one transaction', async () => {
    await Expense.create({
      trip: tripId,
      paidBy: userA,
      amount: 1000,
      category: 'Food',
      splitBetween: [
        { user: userA, share: 500 },
        { user: userB, share: 500 },
      ],
    });

    const result = await calculateSettlement(tripId);

    expect(result.transactions).toHaveLength(1);
    expect(result.transactions[0].from.toString()).toBe(userB.toString());
    expect(result.transactions[0].to.toString()).toBe(userA.toString());
    expect(result.transactions[0].amount).toBe(500);
  });

  test('three-person chain settles in at most n-1 transactions', async () => {
    await Expense.create({
      trip: tripId,
      paidBy: userA,
      amount: 900,
      category: 'Hotel',
      splitBetween: [
        { user: userA, share: 300 },
        { user: userB, share: 300 },
        { user: userC, share: 300 },
      ],
    });

    const result = await calculateSettlement(tripId);

    expect(result.transactions.length).toBeLessThanOrEqual(2);

    const totalSettled = result.transactions.reduce((sum, t) => sum + t.amount, 0);
    expect(totalSettled).toBe(600);
  });

  test('exactly balanced expenses produce zero transactions', async () => {
    await Expense.create({
      trip: tripId,
      paidBy: userA,
      amount: 200,
      category: 'Food',
      splitBetween: [{ user: userA, share: 200 }],
    });

    const result = await calculateSettlement(tripId);

    expect(result.transactions).toHaveLength(0);
  });

  test('no expenses produces no transactions and no crash', async () => {
    const result = await calculateSettlement(tripId);
    expect(result.transactions).toEqual([]);
  });
});