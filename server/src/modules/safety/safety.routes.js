const express = require('express');
const { report, block, unblock } = require('./safety.controller');
const { authenticate } = require('../../middleware/auth.middleware');

const router = express.Router();

router.post('/report', authenticate, report);
router.post('/block/:userId', authenticate, block);
router.delete('/block/:userId', authenticate, unblock);

module.exports = router;