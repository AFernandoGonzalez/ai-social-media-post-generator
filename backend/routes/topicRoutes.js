const express = require('express');
const { createTopic, getTopicById, generateContent, saveContent, updateTopic, deleteTopic, updateContent, deleteContent } = require('../controllers/topicController');
const authenticate = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/:id', authenticate, getTopicById);
router.post('/', authenticate, createTopic);
router.post('/:id/generate-content', authenticate, generateContent);
router.post('/:id/save-content', authenticate, saveContent);
router.put('/:id', authenticate, updateTopic);
router.delete('/:id', authenticate, deleteTopic);
router.put('/content/:id', authenticate, updateContent); 
router.delete('/content/:id', authenticate, deleteContent); 

module.exports = router;
