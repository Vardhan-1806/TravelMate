const express = require('express');
const multer = require('multer');
const { create, getOne } = require('./memory.controller');
const { authenticate } = require('../../middleware/auth.middleware');
const { requireTripMembership } = require('../../middleware/tripMembership.middleware');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed'));
    }
    cb(null, true);
  },
});

const router = express.Router();

router.post('/trips/:tripId', authenticate, requireTripMembership, upload.array('photos', 10), create);
router.get('/trips/:tripId', authenticate, requireTripMembership, getOne);

module.exports = router;