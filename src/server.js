const express = require('express');
const connectDB = require('./config/db');
// import shit
const userRoutes = require('./routes/userRoutes');
const communityRoutes = require('./routes/communityRoutes');
const postRoutes = require('./routes/postRoutes');
const commentRoutes = require('./routes/commentRoutes');
const voteRoutes = require('./routes/voteRoutes');

connectDB();

const app = express();

app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/communities', communityRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/votes', voteRoutes); 

app.get('/', (req, res) => {
    res.send('API is running...');
});

const PORT =5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));