const express = require('express');
const { stats, reports, updateReport, updateSuspension } = require('./admin.controller');
const { authenticate, authorize } = require('../../middleware/auth.middleware');

const router = express.Router();

router.use(authenticate, authorize('ADMIN'));

router.get('/stats', stats);
router.get('/reports', reports);
router.patch('/reports/:reportId', updateReport);
router.patch('/users/:userId/suspend', updateSuspension);

module.exports = router;