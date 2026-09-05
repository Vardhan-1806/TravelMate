const { GoogleGenerativeAI } = require('@google/generative-ai');
const ItineraryItem = require('../itinerary/itineraryItem.model');
const Budget = require('../budget/budget.model');
const Trip = require('../trips/trip.model');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const buildContext = async (tripId, userId) => {
  const [trip, itineraryItems, budget] = await Promise.all([
    Trip.findById(tripId),
    ItineraryItem.find({ trip: tripId }).sort({ date: 1 }),
    Budget.findOne({ trip: tripId, user: userId }),
  ]);

  const itineraryText = itineraryItems.length > 0
    ? itineraryItems.map((i) => `- ${i.date.toDateString()}: ${i.title} (${i.time || 'no time set'}) at ${i.location || 'location not set'}`).join('\n')
    : 'No itinerary items planned yet.';

  const budgetText = budget
    ? Object.entries(budget.categories.toObject())
        .map(([cat, val]) => `${cat}: estimated ₹${val.estimated}, actual ₹${val.actual}`)
        .join('\n')
    : 'No budget set yet.';

  return `Trip: ${trip.title} (${trip.destination}, ${trip.startDate.toDateString()} to ${trip.endDate.toDateString()})

Current Itinerary:
${itineraryText}

Current Budget:
${budgetText}`;
};

const askAssistant = async (tripId, userId, question) => {
  const context = await buildContext(tripId, userId);

  const prompt = `You are a travel assistant helping with a specific, already-planned trip. Use ONLY the real trip data below to answer — do not invent itinerary items, prices, or details not present in this data. If the data doesn't contain enough information to answer, say so honestly rather than guessing.

${context}

User's question: ${question}

Give a helpful, concise answer (2-4 sentences) based strictly on the data above. If suggesting something not in the current plan (like a new activity), clearly mark it as a suggestion, not something already planned.`;

  const model = genAI.getGenerativeModel({ model: 'gemini-3.6-flash' });
  const result = await model.generateContent(prompt);

  return {
    answer: result.response.text(),
    isAiGenerated: true,
  };
};

module.exports = { askAssistant };