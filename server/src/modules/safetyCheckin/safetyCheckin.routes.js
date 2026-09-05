const express = require('express');
const {
  addContact, listContacts, share, createCheckIn, confirm, runMissedCheck,
} = require('./safetyCheckin.controller');
const { authenticate, authorize } = require('../../middleware/auth.middleware');

const router = express.Router();

router.post('/contacts', authenticate, addContact);
router.get('/contacts', authenticate, listContacts);
router.post('/trips/:tripId/share', authenticate, share);
router.post('/trips/:tripId/checkin', authenticate, createCheckIn);
router.patch('/checkin/:checkInId/confirm', authenticate, confirm);
router.post('/admin/process-missed', authenticate, authorize('ADMIN'), runMissedCheck);

module.exports = router;