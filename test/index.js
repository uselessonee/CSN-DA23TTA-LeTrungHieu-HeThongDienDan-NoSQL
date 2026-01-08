const express = require('express');
const connectDB = require('../config/db');
const User = require('../models/users');

const app = express();
const PORT = 3000;


app.get('/', (req, res) => {
    res.send('Server connected to DB and running!');
});

const startServer = async () => {
    try {
        await connectDB();

        app.listen(PORT, () => {
            console.log(`Server successfully connected to DB and listening on port ${PORT}`);
        });

    } catch (error) {
        console.error('Server startup failed:', error);
        process.exit(1);
    }
};

startServer();