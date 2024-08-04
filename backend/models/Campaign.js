const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const campaignSchema = new Schema({
    title: { type: String, required: true },
    user: { type: String, required: true }, 
    topics: [{ type: Schema.Types.ObjectId, ref: 'Topic' }],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Campaign', campaignSchema);
