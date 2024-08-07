const express = require('express');
const { convertTextToSpeech, getUserAudios, getPresignedUrl, updateAudioFileName, deleteAudio, generateCaption, generateImage } = require('../controllers/audioController');
const authenticate = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', authenticate, convertTextToSpeech);
// router.post('/generate-image', authenticate, generateImage);
// router.post('/generate-caption', authenticate, generateCaption);
router.get('/user', authenticate, getUserAudios);
router.get('/presigned-url/:fileName', authenticate, getPresignedUrl);
router.put('/:id', authenticate, updateAudioFileName);
router.delete('/:id', authenticate, deleteAudio);

module.exports = router;
