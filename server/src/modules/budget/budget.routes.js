const express = require('express');
const { setBudget, getSummary } = require('./budget.controller');
const { authenticate } = require('../../middleware/auth.middleware');
const { requireTripMembership } = require('../../middleware/tripMembership.middleware');

const router = express.Router();

router.put('/trips/:tripId', authenticate, requireTripMembership, setBudget);
router.get('/trips/:tripId', authenticate, requireTripMembership, getSummary);

module.exports = router;