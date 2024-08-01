const Campaign = require('../models/Campaign');

// Create a new campaign
exports.createCampaign = async (req, res) => {
    try {
        const { title } = req.body;

        if (!title) {
            return res.status(400).json({ message: 'Title is required.' });
        }

        const newCampaign = new Campaign({ title });
        await newCampaign.save();

        res.status(201).json({ message: 'Campaign created successfully', campaign: newCampaign });
    } catch (error) {
        console.error('Error creating campaign:', error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Fetch campaigns with posts
exports.getCampaigns = async (req, res) => {
    try {
        const campaigns = await Campaign.find().populate('posts');
        res.status(200).json(campaigns);
    } catch (error) {
        console.error('Error fetching campaigns:', error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
};
