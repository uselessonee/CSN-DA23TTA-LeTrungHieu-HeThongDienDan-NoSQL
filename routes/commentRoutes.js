const express = require('express');
const router = express.Router();
const { 
    getCommentsByPost, 
    getCommentById, 
    createComment, 
    updateComment, 
    deleteComment 
} = require('../controllers/commentController');

//http://localhost:5000/api/comments/:postId
router.get('/:postId', getCommentsByPost); 


//  http://localhost:5000/api/comments/single/:id 
router.get('/single/:id', getCommentById); 


//  http://localhost:5000/api/comments/
router.post('/', createComment);

// http://localhost:5000/api/comments/:id
router.put('/:id', updateComment);
router.patch('/:id', updateComment); // Use PATCH for partial updates if desired

//  http://localhost:5000/api/comments/:id
router.delete('/:id', deleteComment);


module.exports = router;