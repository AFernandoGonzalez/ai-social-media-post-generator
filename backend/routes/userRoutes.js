const express = require('express');
const { createUser, getUser } = require('../controllers/userController');
const authenticate = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/me', authenticate, getUser);
router.post('/create', authenticate, createUser);

module.exports = router;
