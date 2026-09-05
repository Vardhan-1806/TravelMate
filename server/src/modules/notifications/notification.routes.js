const express = require('express');
const { getAll, read } = require('./notification.controller');
const { authenticate } = require('../../middleware/auth.middleware');

const router = express.Router();

router.get('/', authenticate, getAll);
router.patch('/:id/read', authenticate, read);

module.exports = router;