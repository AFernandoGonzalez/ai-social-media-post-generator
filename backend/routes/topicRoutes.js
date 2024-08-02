const express = require('express');
const { createTopic, getTopicById, generateContent, saveContent } = require('../controllers/topicController');
const router = express.Router();

router.post('/', createTopic);
router.get('/:id', getTopicById);
router.post('/:id/generate-content', generateContent);
router.post('/:id/save-content', saveContent);

module.exports = router;
