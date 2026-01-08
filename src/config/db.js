const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(process.cwd(), '.env') });

const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI;

const connectDB = async () => {
    if (!MONGODB_URI) {
        console.error('Missing MONGODB_URI in environment. Please set it in .env or environment variables.');
        process.exit(1);
    }

    try {
        // modern mongoose (v6+) no longer requires/use these options; pass only the URI
        await mongoose.connect(MONGODB_URI);
        
        console.log('DB connection successful.');
        console.log(`Database selected/in use: ${mongoose.connection.name}`);

    } catch (err) {
        console.error('MongoDB connection failed:', err.message);
        process.exit(1);
    }
};

module.exports = connectDB;