const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const topicSchema = new Schema({
    title: { type: String, required: true },
    campaign: { type: Schema.Types.ObjectId, ref: 'Campaign', required: true },
    content: [{ type: Schema.Types.ObjectId, ref: 'Content' }],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Topic', topicSchema);
