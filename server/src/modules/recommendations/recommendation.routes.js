const express = require('express');
const { getRecommendations } = require('./recommendation.controller');
const { authenticate } = require('../../middleware/auth.middleware');

const router = express.Router();

router.get('/', authenticate, getRecommendations);

module.exports = router;