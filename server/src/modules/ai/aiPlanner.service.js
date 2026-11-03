const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const buildPrompt = ({ destination, source, days, budget, interests }) => {
  return `You are a travel planning assistant. Generate a suggested itinerary based on these details:

Destination: ${destination}
Source: ${source}
Duration: ${days} days
Budget: ₹${budget} total
Interests: ${interests?.join(', ') || 'general sightseeing'}

IMPORTANT RULES:
- Do NOT state specific real-time prices, hotel availability, or transport schedules as fact — these change constantly and you cannot know current values.
- Frame all cost estimates as rough approximations, not guaranteed prices.
- Do NOT invent specific business names (hotels, restaurants) unless they are extremely well-known landmarks.
- Focus on activity suggestions, a reasonable day-by-day structure, and general budget allocation guidance.

Respond ONLY with valid JSON in this exact structure, no other text, no markdown code fences:
{
  "summary": "one paragraph overview",
  "days": [
    { "day": 1, "activities": ["activity 1", "activity 2"], "estimatedCost": "rough range like ₹1000-1500" }
  ],
  "budgetBreakdown": { "transport": "estimate", "accommodation": "estimate", "food": "estimate", "activities": "estimate" },
  "packingNotes": ["note 1", "note 2"]
}`;
};

const generateTripPlan = async ({ destination, source, days, budget, interests }) => {
  if (!process.env.GEMINI_API_KEY) {
    const error = new Error('AI planning is not configured');
    error.statusCode = 503;
    throw error;
  }
  if (typeof destination !== 'string' || destination.trim().length < 2 || !Number.isInteger(Number(days)) || Number(days) < 1 || Number(days) > 30 || Number(budget) < 0) {
    const error = new Error('Destination, duration, and budget must be valid');
    error.statusCode = 400;
    throw error;
  }

  const prompt = buildPrompt({ destination, source, days, budget, interests });

  const model = genAI.getGenerativeModel({ model: 'gemini-3.6-flash' });
  const result = await model.generateContent(prompt);
  const rawText = result.response.text();

  let parsed;
  try {
    const cleaned = rawText.replace(/```json|```/g, '').trim();
    parsed = JSON.parse(cleaned);
    if (!parsed || typeof parsed.summary !== 'string' || !Array.isArray(parsed.days) || !parsed.budgetBreakdown || !Array.isArray(parsed.packingNotes)) {
      throw new Error('Invalid AI plan shape');
    }
  } catch (err) {
    const error = new Error('AI response could not be parsed. Please try again.');
    error.statusCode = 502;
    throw error;
  }

  return {
    ...parsed,
    disclaimer: 'This itinerary is AI-generated and based on general knowledge. Prices, availability, and schedules are estimates only — please verify current details before booking.',
    isAiGenerated: true,
  };
};

module.exports = { generateTripPlan };
