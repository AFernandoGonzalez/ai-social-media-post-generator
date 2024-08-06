const express = require('express');
const http = require('http');
const cors = require('cors');
const connectDB = require('./config/db');
const campaignRoutes = require('./routes/campaignRoutes');
const topicRoutes = require('./routes/topicRoutes');
const userRoutes = require('./routes/userRoutes');
const dotenv = require('dotenv');
const rateLimit = require('express-rate-limit');
const { Server } = require('socket.io');

dotenv.config();

const setupApp = () => {
    const app = express();
    connectDB();

    const limiter = rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 100,
        message: 'Too many requests from this IP, please try again after 15 minutes'
    });

    app.use(express.json());
    app.use(cors());

    app.use('/api/campaigns', campaignRoutes);
    app.use('/api/topics', topicRoutes);
    app.use('/api/users', userRoutes);

    return app;
}

const app = setupApp();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET']
    }
});

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('iconClicked', (icon) => {
        io.emit('iconClicked', icon);
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected:', socket.id);
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = setupApp;
