const express = require('express');
const { geocode, nearby } = require('./maps.controller');
const { authenticate } = require('../../middleware/auth.middleware');

const router = express.Router();

router.get('/geocode', authenticate, geocode);
router.get('/nearby', authenticate, nearby);

module.exports = router;