const User = require('../models/users'); 

const getUsers = async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createUser = async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Please include a username, email, and password.' });
    }

    try {
        // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User with this email already exists.' });
        }

        const user = await User.create({
            username,
            email,
            password, 
        });

        res.status(201).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            joinedAt: user.joinedAt,
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password'); 
        
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        // Handle invalid MongoDB ID format
        if (error.kind === 'ObjectId') {
             return res.status(400).json({ message: 'Invalid User ID format' });
        }
        res.status(500).json({ message: error.message });
    }
};


const updateUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (user) {
            user.username = req.body.username || user.username;
            user.email = req.body.email || user.email;

            if (req.body.password) {
                user.password = req.body.password;
            }
            user.profilePictureURL = req.body.profilePictureURL || user.profilePictureURL;

            const updatedUser = await user.save();

            res.status(200).json({
                _id: updatedUser._id,
                username: updatedUser.username,
                email: updatedUser.email,
            });

        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteUser = async (req, res) => {
    try {
        const result = await User.findByIdAndDelete(req.params.id);

        if (result) {
            res.status(200).json({ message: 'User removed successfully' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getUsers,
    createUser,
    getUserById,
    updateUser,
    deleteUser,
};