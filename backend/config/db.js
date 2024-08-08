const mongoose = require('mongoose');

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

mongoose.connection.on('connected', () => {
    console.log('Mongoose connected to DB');
});

mongoose.connection.on('error', (err) => {
    console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected');
});

module.exports = connectDB;
