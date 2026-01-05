const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        default: null,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    community: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Community',
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
    commentCount: {
        type: Number,
        required: true,
        default: 0,
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now,
    },
    postType: {
        type: String,
        enum: ["text", "link", "image"],
        required: true,
    },
    linkURL: {
        type: String,
        default: null,
    },
    thumbnailURL: {
        type: String,
        default: null,
    },
});

postSchema.index({ community: 1 }, { name: "filter_by_community_idx" });
postSchema.index({ community: 1, createdAt: -1 }, { name: "new_feed_sort_idx" });
postSchema.index({ community: 1, upvotes: -1 }, { name: "top_feed_sort_idx" });

module.exports = mongoose.model('Post', postSchema);