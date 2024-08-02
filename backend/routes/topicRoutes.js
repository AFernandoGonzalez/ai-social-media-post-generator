const express = require('express');
const { createTopic, getTopicById, generateContent } = require('../controllers/topicController');
const router = express.Router();

router.post('/', createTopic);
router.get('/:id', getTopicById);
router.post('/:id/generate-content', generateContent);

module.exports = router;
