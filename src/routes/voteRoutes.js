const express = require('express');
const router = express.Router();
const {
    createOrUpdatePostVote,
    getUserPostVoteStatus,
} = require('../controllers/voteController');

router.post('/post', createOrUpdatePostVote);

router.get('/post/:postId/:userId', getUserPostVoteStatus);

module.exports = router;

