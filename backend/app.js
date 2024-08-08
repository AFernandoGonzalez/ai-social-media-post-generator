require('dotenv-safe').config({
    example: '.env.example'
});

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const campaignRoutes = require('./routes/campaignRoutes');
const topicRoutes = require('./routes/topicRoutes');
const userRoutes = require('./routes/userRoutes');
const audioRoutes = require('./routes/audioRoutes');

const setupApp = () => {
    const app = express();
    connectDB();

    app.use(express.json());
    app.use(cors());

    app.use('/api/campaigns', campaignRoutes);
    app.use('/api/topics', topicRoutes);
    app.use('/api/users', userRoutes);
    app.use('/api/audio', audioRoutes);

    app.use((err, req, res, next) => {
        console.error(err.stack);
        res.status(500).json({ message: 'Internal server error', error: err.message });
    });

    return app;
};

module.exports = setupApp;
