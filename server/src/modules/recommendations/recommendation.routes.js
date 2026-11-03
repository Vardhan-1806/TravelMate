const express = require('express');
const { getRecommendations, interact } = require('./recommendation.controller');
const { authenticate } = require('../../middleware/auth.middleware');

const router = express.Router();

router.get('/', authenticate, getRecommendations);
router.post('/:tripId/interactions', authenticate, interact);

module.exports = router;
