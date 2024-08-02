const Campaign = require('../models/Campaign'); // Add this line
const Topic = require('../models/Topic');
const Content = require('../models/Content');
const { generateContent } = require('../services/aiServices');

exports.createTopic = async (req, res) => {
    try {
        const { title, campaignId } = req.body;
        if (!title || !campaignId) return res.status(400).json({ message: 'Title and campaignId are required.' });

        const newTopic = new Topic({ title, campaign: campaignId });
        await newTopic.save();

        const campaign = await Campaign.findById(campaignId);
        campaign.topics.push(newTopic._id);
        await campaign.save();

        res.status(201).json({ message: 'Topic created successfully', topic: newTopic });
    } catch (error) {
        console.error('Error creating topic:', error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getTopicById = async (req, res) => {
    try {
        const { id } = req.params;
        const topic = await Topic.findById(id).populate('content');
        if (!topic) return res.status(404).json({ message: 'Topic not found' });

        res.status(200).json(topic);
    } catch (error) {
        console.error('Error fetching topic:', error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.generateContent = async (req, res) => {
    try {
        const { id } = req.params;
        const { platform, type, tone, style, mediaUrl } = req.body;

        const topic = await Topic.findById(id);
        if (!topic) return res.status(404).json({ message: 'Topic not found' });

        const generatedText = await generateContent({ topic: topic.title, platform, type, tone, style, mediaUrl });
        const newContent = new Content({ type, platform, text: generatedText, topic: id });
        await newContent.save();

        topic.content.push(newContent._id);
        await topic.save();

        res.status(201).json({ message: 'Content generated successfully', content: newContent });
    } catch (error) {
        console.error('Error generating content:', error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
};
