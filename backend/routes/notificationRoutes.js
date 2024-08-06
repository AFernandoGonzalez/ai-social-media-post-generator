const express = require('express');
const { broadcastNewUser } = require('../controllers/notificationController');

const router = express.Router();

router.post('/broadcast/:id', broadcastNewUser);

module.exports = router;
