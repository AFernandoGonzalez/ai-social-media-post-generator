const cors = require('cors');

const corsOptions = {
    origin: ['http://localhost:5173','https://www.quickcontentai.com', 'https://ai-social-media-post-generator-api.vercel.app'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
};

module.exports = cors(corsOptions);
