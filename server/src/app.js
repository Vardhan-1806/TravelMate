const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const crypto = require('crypto');
const mongoose = require('mongoose');
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

app.set('trust proxy', 1);
app.use(helmet());
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Origin is not allowed by CORS'));
  },
  credentials: true,
}));
app.use((req, res, next) => {
  const requestId = req.get('x-request-id') || crypto.randomUUID();
  req.requestId = requestId;
  res.setHeader('x-request-id', requestId);
  next();
});
app.use(express.json({ limit: '100kb' }));
app.use(cookieParser());

app.get('/api/health', (req, res) => {
  const databaseReady = mongoose.connection.readyState === 1;
  res.status(200).json({
    status: databaseReady ? 'ok' : 'degraded',
    database: databaseReady ? 'connected' : 'disconnected',
    requestId: req.requestId,
  });
});

app.get('/api/ready', (req, res) => {
  const databaseReady = mongoose.connection.readyState === 1;
  res.status(databaseReady ? 200 : 503).json({
    status: databaseReady ? 'ready' : 'not_ready',
    database: databaseReady ? 'connected' : 'disconnected',
    requestId: req.requestId,
  });
});
const rateLimit = require('express-rate-limit');

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  message: { message: 'Too many requests, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.path === '/health',
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  message: { message: 'Too many attempts, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => process.env.DISABLE_RATE_LIMITS === 'true' || process.env.NODE_ENV !== 'production',
});

const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  message: { message: 'Too many AI requests, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => process.env.DISABLE_RATE_LIMITS === 'true' || process.env.NODE_ENV !== 'production',
});

app.use('/api/auth', authLimiter, authRoutes);
app.use('/api', apiLimiter);
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
app.use('/api/ai', aiLimiter, aiPlannerRoutes);
app.use('/api/ai/assistant', aiLimiter, aiAssistantRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/maps', mapsRoutes);
app.use('/api/safety-checkin', safetyCheckinRoutes);
app.use('/api/memories', memoryRoutes);
app.use('/api/communities', communityRoutes);
app.use('/api/messages', messageRoutes);

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found', requestId: req.requestId });
});

app.use((err, req, res, next) => {
  if (res.headersSent) return next(err);
  const status = err.statusCode || (err.message?.includes('CORS') ? 403 : 500);
  if (status >= 500) console.error(`[${req.requestId}]`, err);
  res.status(status).json({
    message: status >= 500 && process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message || 'Server error',
    requestId: req.requestId,
  });
});

module.exports = app;
