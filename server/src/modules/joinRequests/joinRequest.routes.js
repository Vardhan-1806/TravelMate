const express = require('express');
const { create, respond, list } = require('./joinRequest.controller');
const { authenticate } = require('../../middleware/auth.middleware');

const router = express.Router();

router.post('/trips/:tripId/join', authenticate, create);
router.get('/trips/:tripId', authenticate, list);
router.patch('/:requestId/respond', authenticate, respond);

module.exports = router;
