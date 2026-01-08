const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true, 
    },
    password: {
        type: String,
        required: true,
    },
    joinedAt: {
        type: Date,
        required: true,
        default: Date.now,
    },
    communities: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Community',
        default: []
    }],
    profilePictureURL: {
        type: String,
        default: null,
    },
});

module.exports = mongoose.model('User', userSchema);