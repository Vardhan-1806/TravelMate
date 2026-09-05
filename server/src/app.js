const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const authRoutes = require('./modules/auth/auth.routes');
const profileRoutes = require('./modules/profiles/profile.routes');
const tripRoutes = require('./modules/trips/trip.routes');
const matchingRoutes = require('./modules/matching/matching.routes');
const joinRequestRoutes = require('./modules/joinRequests/joinRequest.routes');
const workspaceRoutes = require('./modules/trips/workspace.routes');
const itineraryRoutes = require('./modules/itinerary/itineraryItem.routes');
const pollRoutes = require('./modules/polls/poll.routes');
const budgetRoutes = require('./modules/budget/budget.routes');
const expenseRoutes = require('./modules/expenses/expense.routes');
const reviewRoutes = require('./modules/reviews/review.routes');
const notificationRoutes = require('./modules/notifications/notification.routes');
const safetyRoutes = require('./modules/safety/safety.routes');
const adminRoutes = require('./modules/admin/admin.routes');
const preparationRoutes = require('./modules/preparation/preparation.routes');
const readinessRoutes = require('./modules/readiness/readiness.routes');
const aiPlannerRoutes = require('./modules/ai/aiPlanner.routes');
const aiAssistantRoutes = require('./modules/ai/aiAssistant.routes');
const recommendationRoutes = require('./modules/recommendations/recommendation.routes');
const mapsRoutes = require('./modules/maps/maps.routes');
const safetyCheckinRoutes = require('./modules/safetyCheckin/safetyCheckin.routes');
const memoryRoutes = require('./modules/memories/memory.routes');
const communityRoutes = require('./modules/communities/community.routes');
const messageRoutes = require('./modules/chat/message.routes');



const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});
const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  message: { message: 'Too many attempts, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/matching', matchingRoutes);
app.use('/api/join-requests', joinRequestRoutes);
app.use('/api/workspace', workspaceRoutes);
app.use('/api/itinerary', itineraryRoutes);
app.use('/api/polls', pollRoutes);
app.use('/api/budget', budgetRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/safety', safetyRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/preparation', preparationRoutes);
app.use('/api/readiness', readinessRoutes);
app.use('/api/ai', aiPlannerRoutes);
app.use('/api/ai/assistant', aiAssistantRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/maps', mapsRoutes);
app.use('/api/safety-checkin', safetyCheckinRoutes);
app.use('/api/memories', memoryRoutes);
app.use('/api/communities', communityRoutes);
app.use('/api/messages', messageRoutes);



module.exports = app;