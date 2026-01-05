const { faker, fakerVI } = require('@faker-js/faker');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const connectDB = require('../config/db');
const User = require('../models/users');
const Community = require('../models/community');
const Post = require('../models/post');
const Comment = require('../models/comment');
const Vote = require('../models/votes');

const NUM_USERS = 100;
const NUM_COMMUNITIES = 5;
const MAX_POSTS_PER_COMMUNITY = 50;
const MAX_COMMENTS_PER_POST = 20;
const MAX_VOTES_PER_POST = 20;

const randomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// --- GENERATORS ---

function genUsers() {
    const users = [];
    for (let i = 0; i < NUM_USERS; i++) {
        const firstName = fakerVI.person.firstName();
        const lastName = fakerVI.person.lastName();
        const username = faker.internet.userName({ firstName, lastName });
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
    const vietnameseCommunityData = [
        { name: 'Cộng Đồng Lập Trình Việt', description: 'Kiến thức lập trình và công nghệ.' },
        { name: 'Data Science & AI Vietnam', description: 'Diễn đàn AI và Big Data.' },
        { name: 'Freelancer Chuyên Nghiệp VN', description: 'Cơ hội việc làm tự do.' },
        { name: 'Thiết Kế Đồ Họa Cao Cấp', description: 'Xu hướng thiết kế đồ họa.' },
        { name: 'Blockchain & Web3 Việt Nam', description: 'Công nghệ chuỗi khối và Web3.' },
    ];

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
            administrators: [creatorId], // Khởi tạo admin là creator
            moderators: [],
        });
    }
    return communities;
}

async function loadPostsFromCSV(user_ids, community_ids) {
    const posts = [];
    const filePath = path.join(__dirname, './posts.csv');

    const getRandomId = (arr) => faker.helpers.arrayElement(arr);

    return new Promise((resolve, reject) => {
        if (!fs.existsSync(filePath)) {
            console.warn("Không tìm thấy file posts.csv, bỏ qua bước này.");
            return resolve([]);
        }

        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (row) => {
                posts.push({
                    title: row.title,
                    content: row.content || null,
                    author: getRandomId(user_ids), 
                    community: getRandomId(community_ids),
                    upvotes: 0, // Sẽ update sau khi seed Vote
                    downvotes: 0,
                    commentCount: 0,
                    createdAt: row.createdAt ? new Date(row.createdAt) : fakerVI.date.recent({ days: 365 }),
                    postType: row.postType || "text",
                    linkURL: row.linkURL || null,
                    thumbnailURL: row.thumbnailURL || null,
                });
            })
            .on('end', () => resolve(posts))
            .on('error', (err) => reject(err));
    });
}

async function loadCommentsFromCSV(user_ids, post_ids) {
    const comments = [];
    const filePath = path.join(__dirname, './comments.csv');
    const getRandomId = (arr) => faker.helpers.arrayElement(arr);

    return new Promise((resolve, reject) => {
        if (!fs.existsSync(filePath)) {
            console.warn("⚠️ Không tìm thấy file comments.csv, bỏ qua.");
            return resolve([]);
        }

        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (row) => {
                comments.push({
                    content: row.content,
                    author: getRandomId(user_ids),
                    post: getRandomId(post_ids),
                    upvotes: parseInt(row.upvotes) || 0,
                    downvotes: parseInt(row.downvotes) || 0,
                    createdAt: row.createdAt ? new Date(row.createdAt) : fakerVI.date.recent(),
                    parentComment: null 
                });
            })
            .on('end', () => resolve(comments))
            .on('error', (err) => reject(err));
    });
}
function genVotes(user_ids, post_ids) {
    const votes = [];
    post_ids.forEach(postId => {
        const numVotes = randomInt(5, MAX_VOTES_PER_POST);
        const voters = faker.helpers.arrayElements(user_ids, Math.min(numVotes, user_ids.length));
        
        voters.forEach(userId => {
            votes.push({
                userId,
                postId,
                voteType: randomElement([1, -1]),
                createdAt: faker.date.recent({ days: 30 }),
            });
        });
    });
    return votes;
}

// --- SEED FUNCTION ---

async function seedDB() {
    await connectDB(); 

    try {
        console.log('Starting Database Seed...');
        
        await Promise.all([
            User.deleteMany({}), Community.deleteMany({}),
            Post.deleteMany({}), Comment.deleteMany({}), Vote.deleteMany({})
        ]);

        // Users
        const insertedUsers = await User.insertMany(genUsers());
        const userIds = insertedUsers.map(u => u._id);
        console.log(`Users: ${userIds.length}`);

        // Communities
        const insertedCommunities = await Community.insertMany(genCommunities(userIds));
        const communityIds = insertedCommunities.map(c => c._id);
        console.log(`Communities: ${communityIds.length}`);

        // Posts
        const postMocks = await loadPostsFromCSV(userIds, communityIds);
        const insertedPosts = await Post.insertMany(postMocks);
        const postIds = insertedPosts.map(p => p._id);
        console.log(`Posts: ${insertedPosts.length}`);

        // Comments
        const commentMocksFromCSV = await loadCommentsFromCSV(userIds, postIds);
        const insertedComments = await Comment.insertMany(commentMocksFromCSV);
        const commentIds = insertedComments.map(c => c._id);
        console.log(`Base Comments: ${insertedComments.length}`);

        // Votes
        const voteMocks = genVotes(userIds, postIds);
        await Vote.insertMany(voteMocks);
        console.log(`Votes: ${voteMocks.length}`);

        // SYNC DATA (Cập nhật các trường đếm)
        console.log('\nSyncing counters...');

        // cập nhật số lượng comment cho mỗi post
        const postUpdates = insertedPosts.map(async (post) => {
            const cCount = insertedComments.filter(c => c.post.toString() === post._id.toString()).length;
            
            // tính upvote/downvote từ voteMocks, tránh query liên tục
            const postVotes = voteMocks.filter(v => v.postId.toString() === post._id.toString());
            const up = postVotes.filter(v => v.voteType === 1).length;
            const down = postVotes.filter(v => v.voteType === -1).length;

            return Post.updateOne(
                { _id: post._id }, 
                { $set: { commentCount: cCount, upvotes: up, downvotes: down } }
            );
        });

        await Promise.all(postUpdates);
        console.log('All counters synced!');
        console.log('\n Database seeding complete!');

    } catch (error) {
        console.error(' Database seeding failed:', error);
    } finally {
        await mongoose.disconnect();
        console.log('MongoDB connection closed.');
    }
}

seedDB();