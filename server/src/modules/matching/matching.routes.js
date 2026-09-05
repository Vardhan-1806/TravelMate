const express = require('express');
const { getMyMatches } = require('./matching.controller');
const { authenticate } = require('../../middleware/auth.middleware');

const router = express.Router();

router.get('/', authenticate, getMyMatches);

module.exports = router;