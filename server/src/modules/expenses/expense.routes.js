const express = require('express');
const { create, settlement } = require('./expense.controller');
const { authenticate } = require('../../middleware/auth.middleware');
const { requireTripMembership } = require('../../middleware/tripMembership.middleware');

const router = express.Router();

router.post('/trips/:tripId', authenticate, requireTripMembership, create);
router.get('/trips/:tripId/settlement', authenticate, requireTripMembership, settlement);

module.exports = router;