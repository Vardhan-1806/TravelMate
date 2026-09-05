const express = require('express');
const { getReadiness } = require('./readiness.controller');
const { authenticate } = require('../../middleware/auth.middleware');
const { requireTripMembership } = require('../../middleware/tripMembership.middleware');

const router = express.Router();

router.get('/trips/:tripId', authenticate, requireTripMembership, getReadiness);

module.exports = router;