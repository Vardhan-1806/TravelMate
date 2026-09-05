const express = require('express');
const { getHistory } = require('./message.controller');
const { authenticate } = require('../../middleware/auth.middleware');
const { requireTripMembership } = require('../../middleware/tripMembership.middleware');

const router = express.Router();

router.get('/trips/:tripId/history', authenticate, requireTripMembership, getHistory);

module.exports = router;