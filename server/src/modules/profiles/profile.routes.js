const express = require('express');
const { getMe, updateMe } = require('./profile.controller');
const { authenticate } = require('../../middleware/auth.middleware');

const router = express.Router();

router.get('/me', authenticate, getMe);
router.patch('/me', authenticate, updateMe);

module.exports = router;