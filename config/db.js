const mongoose = require('mongoose');
const MONGODB_URI = 'mongodb+srv://Hieu11ka:minhlanoob123@cluster0.pzc1ry2.mongodb.net/';

const connectDB = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        
        console.log('DB connection successful.');
        console.log(`Database selected/in use: ${mongoose.connection.name}`); 
        
    } catch (err) {
        console.error('MongoDB connection failed:', err.message);
        process.exit(1); 
    }
};

module.exports = connectDB;