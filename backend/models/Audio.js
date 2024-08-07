const mongoose = require('mongoose');

const audioSchema = new mongoose.Schema({
  user: {
    type: String,
    ref: 'User',
    required: true
  },
  fileName: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Audio', audioSchema);
