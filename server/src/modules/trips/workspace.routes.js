const express = require('express');
const { getWorkspaceOverview } = require('./workspace.controller');
const { authenticate } = require('../../middleware/auth.middleware');
const { requireTripMembership } = require('../../middleware/tripMembership.middleware');

const router = express.Router();

router.get('/:tripId/overview', authenticate, requireTripMembership, getWorkspaceOverview);

module.exports = router;