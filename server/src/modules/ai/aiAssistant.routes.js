const express = require('express');
const { ask } = require('./aiAssistant.controller');
const { authenticate } = require('../../middleware/auth.middleware');
const { requireTripMembership } = require('../../middleware/tripMembership.middleware');

const router = express.Router();

router.post('/trips/:tripId/ask', authenticate, requireTripMembership, ask);

module.exports = router;