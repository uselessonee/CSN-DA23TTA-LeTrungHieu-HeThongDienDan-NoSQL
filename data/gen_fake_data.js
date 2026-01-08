const { faker, fakerVI } = require('@faker-js/faker'); 
const mongoose = require('mongoose');

// --- Import Shit---
const connectDB = require('../config/db');
const User = require('../models/users');
const Community = require('../models/community');
const Post = require('../models/post');
const Comment = require('../models/comment');
const Vote = require('../models/votes');

const NUM_USERS = 500;
const NUM_COMMUNITIES = 5;
const MAX_POSTS_PER_COMMUNITY = 500;
const MAX_COMMENTS_PER_POST = 15;
const MAX_VOTES_PER_POST = 30;

// fuck me
const randomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

function genUsers() {
    console.log(`\nGenerating ${NUM_USERS} users...`);
    const users = [];
    for (let i = 0; i < NUM_USERS; i++) {
        const firstName = fakerVI.person.firstName();
        const lastName = fakerVI.person.lastName();
        const username = fakerVI.internet.userName({ firstName, lastName });
        const email = fakerVI.internet.email({ firstName, lastName });

        users.push({
            username: username.toLowerCase().replace(/[^a-z0-9]/g, ''),
            email: email,
            password: 'password123', 
            joinedAt: faker.date.past({ years: 2 }),
            communities: [],
            profilePictureURL: null,
        });
    }
    return users;
}


function genCommunities(user_ids) {
    console.log(`\nGenerating ${NUM_COMMUNITIES} communities...`);
    const vietnameseCommunityData = [
        { name: 'Cộng Đồng Lập Trình Việt', description: 'Nơi chia sẻ kiến thức về lập trình, công nghệ phần mềm và kinh nghiệm làm việc.' },
        { name: 'Data Science & AI Vietnam', description: 'Diễn đàn dành cho các chuyên gia và người học về Khoa học Dữ liệu, Trí tuệ Nhân tạo và Học Máy.' },
        { name: 'Freelancer Chuyên Nghiệp VN', description: 'Trao đổi cơ hội, kinh nghiệm và mẹo để trở thành freelancer thành công trong các lĩnh vực chuyên môn.' },
        { name: 'Thiết Kế Đồ Họa Cao Cấp', description: 'Nơi trưng bày tác phẩm, thảo luận về xu hướng và kỹ thuật thiết kế đồ họa chuyên sâu.' },
        { name: 'Blockchain & Web3 Việt Nam', description: 'Thảo luận về công nghệ chuỗi khối, DeFi, NFT và các dự án Web3 tại Việt Nam.' },
    ];
    //------ FYI: FUCK THIS shit-------

    const communities = [];
    for (let i = 0; i < NUM_COMMUNITIES; i++) {
        const data = vietnameseCommunityData[i % vietnameseCommunityData.length];
        const creatorId = randomElement(user_ids);

        communities.push({
            name: data.name,
            creator: creatorId,
            description: data.description,
            memberCount: randomInt(100, 5000),
            createdAt: faker.date.past({ years: 1 }),
            logoURL: null,
            bannerURL: null,
            administrators: fakerVI.helpers.arrayElements(user_ids.filter(id => id.toString() !== creatorId.toString()), { min: 1, max: 3 }),
            moderators: [],
        });

        // make creator an admin
        if (!communities[i].administrators.map(String).includes(creatorId.toString())) {
            communities[i].administrators.unshift(creatorId);
        }
    }
    return communities;
}

function genPosts(user_ids, community_ids) {
    console.log('\nGenerating posts...');
    const posts = [];
    community_ids.forEach(communityId => {
        const numPosts = randomInt(5, MAX_POSTS_PER_COMMUNITY);
        for (let i = 0; i < numPosts; i++) {
            const postType = randomElement(["text", "link", "image"]);
            const isLink = postType === "link";
            const isImage = postType === "image";

            posts.push({
                title: fakerVI.lorem.sentence({ min: 5, max: 15 }),
                content: postType === "text" ? fakerVI.lorem.paragraphs({ min: 1, max: 3 }) : null,
                author: randomElement(user_ids),
                community: communityId,
                upvotes: randomInt(0, 50),
                downvotes: randomInt(0, 10),
                commentCount: 0,
                createdAt: fakerVI.date.recent({ days: 365 }),
                postType: postType,
                linkURL: isLink ? faker.internet.url() : null,
                thumbnailURL: isLink || isImage ? null : null,// this cause error,and i have no idea why, so null for now
            });
        }
    });
    return posts;
}
function genComments(user_ids, post_ids) {
    console.log('\nGenerating comments and nested replies...');
    const comments = [];
    
    // Parent Comments
    post_ids.forEach(postId => {
        const numParentComments = randomInt(3, MAX_COMMENTS_PER_POST);
        
        for (let i = 0; i < numParentComments; i++) {
            const parentId = new mongoose.Types.ObjectId(); 
            
            const parentComment = {
                _id: parentId,
                content: fakerVI.lorem.sentences({ min: 1, max: 2 }),
                author: randomElement(user_ids),
                post: postId,
                upvotes: randomInt(0, 15),
                downvotes: randomInt(0, 5),
                createdAt: faker.date.recent({ days: 365 }),
                parentComment: null // Đây là bình luận cấp 1
            };
            comments.push(parentComment);

            // Replies/Child Comments
            // Xác suất 40% bình luận sẽ có phản hồi con
            if (Math.random() < 0.4) {
                const numReplies = randomInt(1, 4); 
                for (let j = 0; j < numReplies; j++) {
                    comments.push({
                        content: "Phản hồi: " + fakerVI.lorem.sentence(),
                        author: randomElement(user_ids),
                        post: postId,
                        upvotes: randomInt(0, 5),
                        downvotes: 0,
                        createdAt: faker.date.between({ from: parentComment.createdAt, to: new Date() }),
                        parentComment: parentId 
                    });
                }
            }
        }
    });

    return comments;
}


function genVotes(user_ids, post_ids) {
    console.log('\nGenerating votes for posts...');
    const postVotes = [];
    post_ids.forEach(postId => {
        const numVotes = randomInt(5, MAX_VOTES_PER_POST);
        const uniqueVoters = faker.helpers.arrayElements(user_ids, { min: 5, max: Math.min(numVotes, user_ids.length) });

        uniqueVoters.forEach(userId => {
            const voteType = randomElement([1, -1]);
            postVotes.push({
                userId: userId,
                postId: postId,
                voteType: voteType,
                createdAt: faker.date.recent({ days: 30 }),
            });
        });
    });
    return postVotes;
}


async function seedDB() {
    await connectDB(); 

    try {
        console.log('\nClearing old data...');
        await Promise.all([
            User.deleteMany({}),
            Community.deleteMany({}),
            Post.deleteMany({}),
            Comment.deleteMany({}),
            Vote.deleteMany({}),
        ]);
        console.log('Old collections cleared.');

        // GENERATE + INSERT USERS
        const userMocks = genUsers();
        const insertedUsers = await User.insertMany(userMocks);
        const userIds = insertedUsers.map(u => u._id);
        console.log(`Inserted ${insertedUsers.length} Users.`);

        // GENERATE + INSERT COMMUNITIES
        const communityMocks = genCommunities(userIds);
        const insertedCommunities = await Community.insertMany(communityMocks);
        const communityIds = insertedCommunities.map(c => c._id);
        console.log(`Inserted ${insertedCommunities.length} Communities.`);

        // UPDATE USERS + COMMUNITY MEMBERSHIPS
        console.log('\nUpdating user community lists...');
        await Promise.all(
            insertedUsers.map(user => {
                const communitiesToJoin = faker.helpers.arrayElements(communityIds, { min: 1, max: 3 });
                return User.updateOne({ _id: user._id }, { $set: { communities: communitiesToJoin } });
            })
        );
        console.log('Users updated with community memberships.');

        //  GENERATE + INSERT POSTS
        const postMocks = genPosts(userIds, communityIds);
        const insertedPosts = await Post.insertMany(postMocks);
        const postIds = insertedPosts.map(p => p._id);
        console.log(`Inserted ${insertedPosts.length} Posts.`);

        // GENERATE + INSERT COMMENTS
        const commentMocks = genComments(userIds, postIds); 
        const insertedComments = await Comment.insertMany(commentMocks);
        console.log(`Inserted ${insertedComments.length} Comments.`);

        // UPDATE POSTS + COMMENT COUNTS
        console.log('\nUpdating post comment counts...');
        const commentCountPromises = insertedPosts.map(post => {
            const count = insertedComments.filter(comment => comment.post.equals(post._id)).length;
            return Post.updateOne({ _id: post._id }, { $set: { commentCount: count } });
        });
        await Promise.all(commentCountPromises);
        console.log('Post comment counts updated.');

        // GENERATE + INSERT VOTES
        const voteMocks = genVotes(userIds, postIds);
        
        const uniqueVoteMocks = [];
        const uniqueKeys = new Set();
        voteMocks.forEach(vote => {
            const key = `${vote.userId}-${vote.postId}`;
            if (!uniqueKeys.has(key)) {
                uniqueVoteMocks.push(vote);
                uniqueKeys.add(key);
            }
        });

        await Vote.insertMany(uniqueVoteMocks);
        console.log(`Inserted ${uniqueVoteMocks.length} unique Post Votes.`);

        // post upvote/downvote counts
        console.log('\nUpdating post vote counts...');
        const postVoteUpdatePromises = insertedPosts.map(async (post) => {

            const votes = uniqueVoteMocks.filter(v => v.postId.equals(post._id)); 
            const upvotes = votes.filter(v => v.voteType === 1).length;
            const downvotes = votes.filter(v => v.voteType === -1).length;
            return Post.updateOne({ _id: post._id }, { upvotes, downvotes });
        });
        await Promise.all(postVoteUpdatePromises);
        console.log('Post vote counts updated.');


        console.log('\nDatabase seeding complete!');

    } catch (error) {
        console.error(' Database seeding failed:', error);
    } finally {
        // AHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH
        await mongoose.disconnect();
        console.log('MongoDB connection closed.');
    }
}

seedDB();