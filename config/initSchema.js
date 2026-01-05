const mongoose = require('mongoose');
const connectDB = require('./db'); 
const User = require('../models/users');
const Community = require('../models/community');
const Post = require('../models/post');
const Comment = require('../models/comment');
const Vote = require('../models/votes');


const validationSchemas = {
    users: {
        bsonType: "object",
        required: ["username", "email", "password", "joinedAt", "communities"],
        properties: {
            username: { bsonType: "string" },
            email: { bsonType: "string" },
            password: { bsonType: "string" },
            joinedAt: { bsonType: "date" },
            communities: { bsonType: "array" }
        }
    },
    communities: {
        bsonType: "object",
        required: ["name", "creator", "description", "memberCount", "createdAt"],
        properties: {
            name: { bsonType: "string" },
            creator: { bsonType: "objectId" },
            description: { bsonType: "string" },
            memberCount: { bsonType: "int" },
            createdAt: { bsonType: "date" }
        }
    },
    posts: {
        bsonType: "object",
        required: ["title", "author", "community", "upvotes", "downvotes", "commentCount", "createdAt", "postType"],
        properties: {
            upvotes: { bsonType: "int" },
            downvotes: { bsonType: "int" },
            commentCount: { bsonType: "int" },
            createdAt: { bsonType: "date" },
            postType: { bsonType: "string", enum: ["text", "link", "image"] }
        }
    },
    comments: {
        bsonType: "object",
        required: ["content", "author", "post", "upvotes", "downvotes", "createdAt"],
        properties: {
            upvotes: { bsonType: "int" },
            downvotes: { bsonType: "int" },
            createdAt: { bsonType: "date" },
            parentComment: { bsonType: ["objectId", "null"] }
        }
    },
    votes: {
        bsonType: "object",
        required: ["userId", "postId", "voteType", "createdAt"],
        properties: {
            voteType: { bsonType: "int", enum: [1, -1] }
        }
    }
};

const models = {
    User,
    Community,
    Post,
    Comment,
    Vote
};


async function initializeSchema() {
    try {
        await connectDB();
        const db = mongoose.connection.db;

        console.log("Starting Mongoose Schema Index and Validation Initialization...");
        console.log("--------------------------------------------------------------------------------");

        for (const [key, Model] of Object.entries(models)) {
            const collectionName = Model.collection.collectionName;
            
            console.log(`\nProcessing Collection: ${collectionName}`);

            await Model.syncIndexes();
            console.log(`- Indexes synced.`);

            const validationSchema = validationSchemas[collectionName];
            if (validationSchema) {
                await db.command({
                    collMod: collectionName,
                    validator: { $jsonSchema: validationSchema },
                    validationAction: "warn"
                });
                console.log(`- $jsonSchema Validation applied.`);
            }
        }

        console.log("\nSchema Initialization FUCKING DONE");

    } catch (error) {
        console.error("Fatal Error during schema initialization:", error);
        process.exit(1);
    } finally {
        await mongoose.connection.close();
        console.log("Connection closed.");
    }
}

initializeSchema();