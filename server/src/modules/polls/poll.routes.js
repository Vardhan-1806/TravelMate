const express = require('express');
const { create, vote, results, close } = require('./poll.controller');
const { authenticate } = require('../../middleware/auth.middleware');
const { requireTripMembership } = require('../../middleware/tripMembership.middleware');

const router = express.Router();

router.post('/trips/:tripId/polls', authenticate, requireTripMembership, create);
router.post('/:pollId/vote', authenticate, vote);
router.get('/:pollId/results', authenticate, results);
router.patch('/:pollId/close', authenticate, close);

module.exports = router;