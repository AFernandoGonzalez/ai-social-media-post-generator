const setupApp = require('../app');
const http = require('http');
const { Server } = require('socket.io');

const { app } = setupApp();

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: ['http://localhost:5173', 'https://www.quickcontentai.com'],
        methods: ['GET', 'POST'],
    },
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

const port = process.env.PORT || 8000;
server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

module.exports = app;
