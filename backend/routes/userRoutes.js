const express = require('express');
const { createUser, getUser } = require('../controllers/userController');
const authenticate = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/create', authenticate, createUser);
router.get('/me', authenticate, getUser);

module.exports = router;
