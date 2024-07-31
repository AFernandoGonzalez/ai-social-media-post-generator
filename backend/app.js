const express = require('express');
const cors = require('cors')
const connectDB = require('./config/db');
const postRoutes = require('./routes/postRoutes');
// const userRoutes = require('./routes/userRoutes');
// const { errorHandler } = require('./middlewares/errorHandler');
const dotenv = require('dotenv');

dotenv.config();


const app = express();
connectDB();

// Middleware
app.use(express.json()); 
app.use(cors());

// Define routes
app.use('/api/posts', postRoutes);
// app.use('/api/users', userRoutes);

// Error handling middleware
// app.use(errorHandler);

// Define the server port
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
