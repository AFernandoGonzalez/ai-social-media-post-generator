const express = require('express');
const { createCampaign, getCampaigns } = require('../controllers/campaignController');
const router = express.Router();

// Campaign Routes
// Route to create a new campaign
router.post('/', createCampaign);

// Route to get all campaigns with their posts
router.get('/', getCampaigns);


module.exports = router;
