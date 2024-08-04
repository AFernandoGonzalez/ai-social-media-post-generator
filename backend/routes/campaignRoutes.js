const express = require('express');
const { createCampaign, getCampaigns, getCampaignById } = require('../controllers/campaignController');
const authenticate = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', authenticate, getCampaigns);
router.get('/:id', authenticate, getCampaignById);
router.post('/', authenticate, createCampaign);

module.exports = router;
