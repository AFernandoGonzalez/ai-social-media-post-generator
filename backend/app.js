const express = require('express');
const cors = require('cors')
const connectDB = require('./config/db');
const postRoutes = require('./routes/postRoutes');
const campaignRoutes = require('./routes/campaignRoutes');
const dotenv = require('dotenv');

dotenv.config();


const app = express();
connectDB();


app.use(express.json()); 
app.use(cors());


app.use('/api/campaigns', campaignRoutes);
app.use('/api/posts', postRoutes);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
