const express = require('express');
const { createTopic, getTopicById, generateContent, saveContent } = require('../controllers/topicController');
const authenticate = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', authenticate, createTopic);
router.get('/:id', authenticate, getTopicById);
router.post('/:id/generate-content', authenticate, generateContent);
router.post('/:id/save-content', authenticate, saveContent);

module.exports = router;
