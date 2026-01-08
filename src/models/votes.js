const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post', // 'Comment' add in future now too lazy
        required: true,
    },
    voteType: {
        type: Number,
        enum: [1, -1],
        required: true,
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now,
    },
});

voteSchema.index({ userId: 1, postId: 1 }, { unique: true, name: "unique_post_vote_idx" });

module.exports = mongoose.model('Vote', voteSchema);