const express = require('express');
const { create, join, post, getPosts, discover } = require('./community.controller');
const { authenticate } = require('../../middleware/auth.middleware');

const router = express.Router();

router.post('/', authenticate, create);
router.get('/', discover);
router.post('/:communityId/join', authenticate, join);
router.post('/:communityId/posts', authenticate, post);
router.get('/:communityId/posts', getPosts);

module.exports = router;