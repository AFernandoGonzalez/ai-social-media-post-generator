const Campaign = require('../models/Campaign');

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

exports.getCampaigns = async (req, res) => {
    try {
        const campaigns = await Campaign.find().populate('posts');
        res.status(200).json(campaigns);
    } catch (error) {
        console.error('Error fetching campaigns:', error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getCampaignById = async (req, res) => {
    try {
        const { id } = req.params;
        const campaign = await Campaign.findById(id).populate('posts');

        if (!campaign) {
            return res.status(404).json({ message: 'Campaign not found' });
        }

        res.status(200).json(campaign);
    } catch (error) {
        console.error('Error fetching campaign:', error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
};
