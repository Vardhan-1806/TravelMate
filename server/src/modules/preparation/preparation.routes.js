const express = require('express');
const { generate, getAll, toggle, addCustom, remove } = require('./preparation.controller');
const { authenticate } = require('../../middleware/auth.middleware');
const { requireTripMembership } = require('../../middleware/tripMembership.middleware');

const router = express.Router();

router.post('/trips/:tripId/generate', authenticate, requireTripMembership, generate);
router.get('/trips/:tripId', authenticate, requireTripMembership, getAll);
router.post('/trips/:tripId/items', authenticate, requireTripMembership, addCustom);
router.patch('/items/:itemId/toggle', authenticate, toggle);
router.delete('/items/:itemId', authenticate, remove);

module.exports = router;