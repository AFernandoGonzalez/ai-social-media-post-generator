const mongoose = require('mongoose');
require('dotenv').config();

const URI = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}/${process.env.DB_NAME_PROD}?retryWrites=true&w=majority`;

const connectDB = async () => {
    try {
        await mongoose.connect(URI);
        console.log('DB Connected!');
    } catch (error) {
        console.error('Cannot connect to DB', error);
        process.exit(1);
    }
};

module.exports = connectDB;
