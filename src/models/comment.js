const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true,
    },
    upvotes: {
        type: Number,
        required: true,
        default: 0,
    },
    downvotes: {
        type: Number,
        required: true,
        default: 0,
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now,
    },
    parentComment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
        default: null,
    },
});

commentSchema.index({ post: 1, createdAt: 1 }, { name: "comments_by_post_and_date_idx" });
commentSchema.index({ parentComment: 1 }, { name: "comments_by_parent_idx" });

module.exports = mongoose.model('Comment', commentSchema);