const express = require('express');
const { register, login, refresh, logout, forgotPassword, completePasswordReset } = require('./auth.controller');
const { authenticate } = require('../../middleware/auth.middleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', completePasswordReset);

router.get('/me', authenticate, (req, res) => {
  res.json({ message: 'You are authenticated', user: req.user });
});

module.exports = router;
