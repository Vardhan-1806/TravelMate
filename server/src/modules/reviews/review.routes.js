const express = require('express');
const { create, getReputation } = require('./review.controller');
const { authenticate } = require('../../middleware/auth.middleware');

const router = express.Router();

router.post('/trips/:tripId', authenticate, create);
router.get('/users/:userId/reputation', getReputation);

module.exports = router;