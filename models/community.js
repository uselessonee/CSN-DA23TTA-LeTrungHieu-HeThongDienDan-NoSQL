const mongoose = require('mongoose');

const communitySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    memberCount: {
        type: Number,
        required: true,
        default: 0,
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now,
    },
    logoURL: {
        type: String,
        default: null,
    },
    bannerURL: {
        type: String,
        default: null,
    },

    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    administrators: [{ 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: []
    }],
    moderators: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        Permissions: {
            type: [String],
            enum: ['manage_posts', 'manage_members', 'edit_community', 'view_reports'],
            default: []
        },
        default: []
    }],
});

module.exports = mongoose.model('Community', communitySchema);