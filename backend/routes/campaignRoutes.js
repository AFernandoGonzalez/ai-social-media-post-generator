const express = require('express');
const { createCampaign, getCampaigns, getCampaignById } = require('../controllers/campaignController');
const router = express.Router();

router.post('/', createCampaign);
router.get('/', getCampaigns);
router.get('/:id', getCampaignById);

module.exports = router;
