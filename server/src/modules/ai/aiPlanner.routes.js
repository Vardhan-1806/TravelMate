const express = require('express');
const { plan } = require('./aiPlanner.controller');
const { authenticate } = require('../../middleware/auth.middleware');

const router = express.Router();

router.post('/plan', authenticate, plan);

module.exports = router;