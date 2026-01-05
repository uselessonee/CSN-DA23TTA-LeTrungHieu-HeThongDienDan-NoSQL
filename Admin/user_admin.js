const express = require('express');
const User = require('../models/users'); 
const router = express.Router();


router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ msg: 'Enter all fields: username, email, and password.' });
    }

    try {
        const newUser = new User({
            username,
            email,
            password: password, 
        });

        const user = await newUser.save();

        res.status(201).json({
            msg: 'User registered Done',
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                joinedAt: user.joinedAt,
            }
        });

    } catch (err) {
        if (err.code === 11000) {
            // 11000: key
            return res.status(400).json({ msg: 'A user with this username or email already exists.' });
        }
        
        if (err.name === 'ValidationError') {
            return res.status(400).json({ msg: err.message });
        }

        console.error(err.message);
        res.status(500).send('Server Error during registration');
    }
});

module.exports = router;