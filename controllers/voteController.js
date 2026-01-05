const Vote = require('../models/votes');
const Post = require('../models/post');

const createOrUpdatePostVote = async (req, res) => {
    const { userId, postId, voteType } = req.body;

    if (!userId || !postId || !voteType) {
        return res.status(400).json({ message: 'Missing required fields: userId, postId, voteType.' });
    }

    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found.' });
        }
        
        // find vote by user on post
        const existingVote = await Vote.findOne({ userId, postId });
        let upvoteChange = 0;
        let downvoteChange = 0;
        let message = '';
        
        if (existingVote) {
            if (existingVote.voteType === voteType) {
                await existingVote.deleteOne();
                if (voteType === 1) upvoteChange = -1;
                if (voteType === -1) downvoteChange = -1;
                message = 'Vote removed.';
            } else {
                const oldType = existingVote.voteType;
                existingVote.voteType = voteType;
                await existingVote.save();

                if (oldType === 1 && voteType === -1) { // upvote to downvote
                    upvoteChange = -1;
                    downvoteChange = 1;
                } else if (oldType === -1 && voteType === 1) { // down to Up
                    upvoteChange = 1;
                    downvoteChange = -1;
                }
                message = 'Vote switched.';
            }
        } else {
            // new vote
            await Vote.create({ userId, postId, voteType });
            if (voteType === 1) upvoteChange = 1;
            if (voteType === -1) downvoteChange = 1;
            message = 'Vote created.';
        }

        // update vote counts
        if (upvoteChange !== 0 || downvoteChange !== 0) {
             const updatedPost = await Post.findByIdAndUpdate(
                postId, 
                { 
                    $inc: { 
                        upvotes: upvoteChange, 
                        downvotes: downvoteChange 
                    } 
                }, 
                { new: true } // return updated doc
            );
            return res.status(200).json({ 
                message: message, 
                upvotes: updatedPost.upvotes, 
                downvotes: updatedPost.downvotes 
            });
        }
        
        res.status(200).json({ message: message, upvotes: post.upvotes, downvotes: post.downvotes });

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getUserPostVoteStatus = async (req, res) => {
    const { postId, userId } = req.params;
    try {
        const vote = await Vote.findOne({ postId, userId });

        if (vote) {
            res.status(200).json({ 
                hasVoted: true, 
                voteType: vote.voteType 
            });
        } else {
            res.status(200).json({ 
                hasVoted: false, 
                voteType: 0 
            });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createOrUpdatePostVote,
    getUserPostVoteStatus,
};