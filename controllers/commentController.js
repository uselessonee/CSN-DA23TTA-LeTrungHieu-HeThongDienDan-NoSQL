const Comment = require('../models/comment');
const Post = require('../models/post');

const getCommentsByPost = async (req, res) => {
    try {
        const comments = await Comment.find({ post: req.params.postId })
            .populate('author', 'username')
            .sort({ createdAt: 1 }); //  date sort
        
        if (comments.length === 0) {
            const postExists = await Post.findById(req.params.postId);
            if (!postExists) {
                return res.status(404).json({ message: 'Post not found.' });
            }
        }
        
        res.status(200).json(comments);
    } catch (error) {
        if (error.kind === 'ObjectId') {
             return res.status(400).json({ message: 'Invalid Post ID format' });
        }
        res.status(500).json({ message: error.message });
    }
};

const getCommentById = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id)
            .populate('author', 'username');

        if (comment) {
            res.status(200).json(comment);
        } else {
            res.status(404).json({ message: 'Comment not found' });
        }
    } catch (error) {
        if (error.kind === 'ObjectId') {
             return res.status(400).json({ message: 'Invalid Comment ID format' });
        }
        res.status(500).json({ message: error.message });
    }
};

const createComment = async (req, res) => {
    const { content, author, post, parentComment } = req.body;

    if (!content || !author || !post) {
        return res.status(400).json({ message: 'Missing required fields: content, author, post ID.' });
    }

    try {
        const postExists = await Post.findById(post);
        if (!postExists) {
            return res.status(404).json({ message: 'Post does not exist.' });
        }

        const comment = await Comment.create({
            content,
            author,
            post,
            parentComment: parentComment || null,
        });

        await Post.findByIdAndUpdate(post, { $inc: { commentCount: 1 } });

        res.status(201).json(comment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const updateComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);

        if (comment) {
            comment.content = req.body.content || comment.content;
            
            const updatedComment = await comment.save();
            res.status(200).json(updatedComment);
        } else {
            res.status(404).json({ message: 'Comment not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }
        
        const postId = comment.post;
        
        await comment.deleteOne();

        // -- the comment count
        await Post.findByIdAndUpdate(postId, { $inc: { commentCount: -1 } });

        res.status(200).json({ message: 'Comment removed successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getCommentsByPost,
    getCommentById,
    createComment,
    updateComment,
    deleteComment,
};