const express = require('express');
const { create, respond } = require('./joinRequest.controller');
const { authenticate } = require('../../middleware/auth.middleware');

const router = express.Router();

router.post('/trips/:tripId/join', authenticate, create);
router.patch('/:requestId/respond', authenticate, respond);

module.exports = router;