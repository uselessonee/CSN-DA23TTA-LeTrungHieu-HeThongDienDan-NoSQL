const Community = require('../models/community');
const User = require('../models/users'); 

const getCommunities = async (req, res) => {
    try {
        const communities = await Community.find({}).populate('creator', 'username');
        res.status(200).json(communities);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};//俺を殺せ

const getCommunityById = async (req, res) => {
    try {
        const community = await Community.findById(req.params.id)
            .populate('creator', 'username email')
            .populate('administrators', 'username')
            .populate('moderators', 'username');

        if (community) {
            res.status(200).json(community);
        } else {
            res.status(404).json({ message: 'Community not found' });
        }
    } catch (error) {
        if (error.kind === 'ObjectId') {
             return res.status(400).json({ message: 'Invalid Community ID format' });
        }
        res.status(500).json({ message: error.message });
    }
};


const createCommunity = async (req, res) => {
    const { name, creator, description } = req.body; 

    if (!name || !creator || !description) {
        return res.status(400).json({ message: 'Please include name, creator ID, and description.' });
    }

    try {
        const communityExists = await Community.findOne({ name });
        if (communityExists) {
            return res.status(400).json({ message: 'Community name already taken.' });
        }

        const community = await Community.create({
            name,
            creator,
            description,

            administrators: [creator], 
            memberCount: 1,
        });

        await User.findByIdAndUpdate(creator, { $push: { communities: community._id } });

        res.status(201).json(community);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


const updateCommunity = async (req, res) => {
    try {
        const community = await Community.findById(req.params.id);

        if (community) {
            community.description = req.body.description || community.description;
            community.logoURL = req.body.logoURL || community.logoURL;
            community.bannerURL = req.body.bannerURL || community.bannerURL;

            const updatedCommunity = await community.save();
            res.status(200).json(updatedCommunity);
        } else {
            res.status(404).json({ message: 'Community not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// IF YOU EVER WONDER, I SPEND FUCKING HALF A DAY!!!!!!!!!!!!!!!!!!!!!!!!!!!!
const deleteCommunity = async (req, res) => {
    try {
        const communityId = req.params.id;
        const result = await Community.findByIdAndDelete(communityId);

        if (result) {
            res.status(200).json({ message: 'Community removed successfully' });
        } else {
            res.status(404).json({ message: 'Community not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getCommunities,
    getCommunityById,
    createCommunity,
    updateCommunity,
    deleteCommunity,
};