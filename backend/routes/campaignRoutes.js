const express = require('express');
const { createCampaign, getCampaigns, getCampaignById, updateCampaign, deleteCampaign } = require('../controllers/campaignController');
const authenticate = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', authenticate, getCampaigns);
router.get('/:id', authenticate, getCampaignById);
router.post('/', authenticate, createCampaign);
router.put('/:id', authenticate, updateCampaign);
router.delete('/:id', authenticate, deleteCampaign);

module.exports = router;
