const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
    topic: { type: String, required: true },
    platform: { type: String, required: true },
    tone: { type: String, required: false },
    style: { type: String, required: false },
    mediaUrl: { type: String, required: false },
    content: { type: String, required: true },
    campaign: { type: Schema.Types.ObjectId, ref: 'Campaign', required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Post', postSchema);
