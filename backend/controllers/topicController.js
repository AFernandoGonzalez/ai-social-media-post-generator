const Topic = require('../models/Topic');
const Campaign = require('../models/Campaign');
const Content = require('../models/Content');
const { generateContent } = require('../services/aiServices');

exports.createTopic = async (req, res) => {
    try {
        const { title, campaignId } = req.body;
        const userId = req.user.uid; 

        if (!title || !campaignId) {
            return res.status(400).json({ message: 'Title and campaignId are required.' });
        }

        const campaign = await Campaign.findOne({ _id: campaignId, user: userId });
        if (!campaign) {
            return res.status(404).json({ message: 'Campaign not found' });
        }

        const newTopic = new Topic({ title, campaign: campaignId });
        await newTopic.save();

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
        const userId = req.user.uid; 

        const topic = await Topic.findOne({ _id: id }).populate('content');
        if (!topic) {
            return res.status(404).json({ message: 'Topic not found' });
        }

        const campaign = await Campaign.findOne({ _id: topic.campaign, user: userId });
        if (!campaign) {
            return res.status(403).json({ message: 'Unauthorized access' });
        }

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
        const userId = req.user.uid; 

        const topic = await Topic.findOne({ _id: id }).populate('content');
        if (!topic) {
            return res.status(404).json({ message: 'Topic not found' });
        }

        const campaign = await Campaign.findOne({ _id: topic.campaign, user: userId });
        if (!campaign) {
            return res.status(403).json({ message: 'Unauthorized access' });
        }

        const generatedText = await generateContent({ topic: topic.title, platform, type, tone, style, mediaUrl });

        res.status(200).json({ text: generatedText });
    } catch (error) {
        console.error('Error generating content with OpenAI:', error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.saveContent = async (req, res) => {
    try {
        const { id } = req.params;
        const { type, platform, text } = req.body;
        const userId = req.user.uid; 

        const topic = await Topic.findOne({ _id: id });
        if (!topic) {
            return res.status(404).json({ message: 'Topic not found' });
        }

        const campaign = await Campaign.findOne({ _id: topic.campaign, user: userId });
        if (!campaign) {
            return res.status(403).json({ message: 'Unauthorized access' });
        }

        const newContent = new Content({ type, platform, text, topic: id });
        await newContent.save();

        topic.content.push(newContent._id);
        await topic.save();

        res.status(201).json({ message: 'Content saved successfully', content: newContent });
    } catch (error) {
        console.error('Error saving content:', error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
};
