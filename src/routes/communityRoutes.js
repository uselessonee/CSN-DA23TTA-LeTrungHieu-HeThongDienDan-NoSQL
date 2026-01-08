const express = require('express');
const router = express.Router();
const {
    getCommunities,
    getCommunityById,
    createCommunity,
    updateCommunity,
    deleteCommunity,
} = require('../controllers/communityController');

router.route('/')
    .get(getCommunities)
    .post(createCommunity);

router.route('/:id')
    .get(getCommunityById)
    .put(updateCommunity)
    .delete(deleteCommunity);

module.exports = router;