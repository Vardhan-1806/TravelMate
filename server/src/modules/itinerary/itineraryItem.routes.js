const express = require('express');
const { create, getAll, update, remove } = require('./itineraryItem.controller');
const { authenticate } = require('../../middleware/auth.middleware');
const { requireTripMembership } = require('../../middleware/tripMembership.middleware');

const router = express.Router();

router.post('/trips/:tripId/items', authenticate, requireTripMembership, create);
router.get('/trips/:tripId/items', authenticate, requireTripMembership, getAll);
router.patch('/items/:itemId', authenticate, update);
router.delete('/items/:itemId', authenticate, remove);

module.exports = router;