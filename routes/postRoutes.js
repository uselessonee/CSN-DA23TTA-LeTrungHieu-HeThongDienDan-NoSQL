const express = require('express');
const router = express.Router();
const {
    getPosts,
    getPostsByCommunity,
    getPostById,
    createPost,
    updatePost,
    deletePost,
} = require('../controllers/postController');

router.route('/')
    .get(getPosts)
    .post(createPost);

// Post feed pẻ community
router.get('/community/:communityId', getPostsByCommunity);

// 1 Post 
router.route('/:id')
    .get(getPostById)
    .put(updatePost)
    .delete(deletePost);

module.exports = router;