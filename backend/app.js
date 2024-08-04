const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const campaignRoutes = require('./routes/campaignRoutes');
const topicRoutes = require('./routes/topicRoutes');
const userRoutes = require('./routes/userRoutes');
const dotenv = require('dotenv');

dotenv.config();

const setupApp = () => {
    const app = express();
    connectDB();

    app.use(express.json());
    
    const frontendUrls = process.env.FRONTEND_URLS.split(',');

    const corsOptions = {
        origin: frontendUrls,
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true, 
    };

    app.use(cors(corsOptions));

    app.use('/api/campaigns', campaignRoutes);
    app.use('/api/topics', topicRoutes);
    app.use('/api/users', userRoutes);

    return app;
}

// const PORT = process.env.PORT || 8000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = setupApp;
