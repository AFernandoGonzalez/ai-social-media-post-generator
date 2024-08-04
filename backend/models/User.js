const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  firstName: { type: String },
  lastName: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);
