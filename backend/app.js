const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const campaignRoutes = require('./routes/campaignRoutes');
const topicRoutes = require('./routes/topicRoutes');
const userRoutes = require('./routes/userRoutes');
const dotenv = require('dotenv');
const rateLimit = require('express-rate-limit');

dotenv.config();

const setupApp = () => {
    const app = express();
    connectDB();

    const limiter = rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 100,
        message: 'Too many requests from this IP, please try again after 15 minutes',
    });

    app.use(express.json());
    app.use(cors());

    app.use(cors({
        origin: ['http://localhost:5173', 'https://www.quickcontentai.com'],
        methods: ['GET', 'POST'],
        credentials: true,
    }));

    app.use('/api/campaigns', campaignRoutes);
    app.use('/api/topics', topicRoutes);
    app.use('/api/users', userRoutes);

    return app;
};

module.exports = setupApp;
