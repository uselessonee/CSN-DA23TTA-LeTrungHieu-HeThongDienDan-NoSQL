const Post = require('../models/post');
const Community = require('../models/community'); 

const getPosts = async (req, res) => {
    const sort = req.query.sort || 'new'; 
    let sortQuery = {};

    switch (sort) {
        case 'top':
            sortQuery = { upvotes: -1, createdAt: -1 };
            break;
        case 'old':
            sortQuery = { createdAt: 1 };
            break;
        case 'new':
        default:
            sortQuery = { createdAt: -1 };
            break;
    }
    
    try {
        const posts = await Post.find({})
            .populate('author', 'username')
            .populate('community', 'name')
            .sort(sortQuery); 
            
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getPostsByCommunity = async (req, res) => {
    const { communityId } = req.params;
    const sort = req.query.sort || 'new'; 
    let sortQuery = {};

    switch (sort) {
        case 'top':
            sortQuery = { upvotes: -1, createdAt: -1 };
            break;
        case 'old':
            sortQuery = { createdAt: 1 };
            break;
        case 'new':
        default:
            sortQuery = { createdAt: -1 };
            break;
    }
    
    try {
        const posts = await Post.find({ community: communityId })
            .populate('author', 'username')
            .populate('community', 'name')
            .sort(sortQuery); 
        
        if (posts.length === 0) {
            // Check community ID just so it won't explode
            const communityExists = await Community.findById(communityId);
            if (!communityExists) {
                return res.status(404).json({ message: 'Community not found.' });
            }
        }

        res.status(200).json(posts);
    } catch (error) {
        if (error.kind === 'ObjectId') {
             return res.status(400).json({ message: 'Invalid Community ID format' });
        }
        res.status(500).json({ message: error.message });
    }
};



const getPostById = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
            .populate('author', 'username email')
            .populate('community', 'name');

        if (post) {
            res.status(200).json(post);
        } else {
            res.status(404).json({ message: 'Post not found' });
        }
    } catch (error) {
        if (error.kind === 'ObjectId') {
             return res.status(400).json({ message: 'Invalid Post ID format' });
        }
        res.status(500).json({ message: error.message });
    }
};

const createPost = async (req, res) => {
    const { title, content, author, community, postType, linkURL, thumbnailURL } = req.body;

    if (!title || !author || !community || !postType) {
        return res.status(400).json({ message: 'Missing required fields: title, author, community, postType.' });
    }

    try {
        const communityExists = await Community.findById(community);
        if (!communityExists) {
            return res.status(404).json({ message: 'Community does not exist.' });
        }

        const post = await Post.create({
            title,
            content,
            author,
            community,
            postType,
            linkURL,
            thumbnailURL,
        });

        res.status(201).json(post);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const updatePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (post) {
            post.title = req.body.title || post.title;
            post.content = req.body.content || post.content;
            
            const updatedPost = await post.save();
            res.status(200).json(updatedPost);
        } else {
            res.status(404).json({ message: 'Post not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deletePost = async (req, res) => {
    try {
        const result = await Post.findByIdAndDelete(req.params.id);

        if (result) {
            // Delete all
            res.status(200).json({ message: 'Post removed successfully' });
        } else {
            res.status(404).json({ message: 'Post not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getPosts,
    getPostsByCommunity,
    getPostById,
    createPost,
    updatePost,
    deletePost,
};