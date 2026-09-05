const express = require('express');
const { create, getOne, discover, complete } = require('./trip.controller');
const { authenticate } = require('../../middleware/auth.middleware');
const { validateCreateTrip, handleValidationErrors } = require('./trip.validator');

const router = express.Router();

router.post('/', authenticate, validateCreateTrip, handleValidationErrors, create);
router.get('/', discover);
router.get('/:id', authenticate, getOne);
router.patch('/:id/complete', authenticate, complete);

module.exports = router;