const express = require('express');
const { createPost } = require('../controllers/postController');
const router = express.Router();

router.post('/', createPost);


module.exports = router;


// const express = require('express');
// const { createPost, getPosts } = require('../controllers/postController');
// const router = express.Router();

// // Route to create a new post
// router.post('/', createPost);

// // Route to get all posts
// router.get('/', getPosts);

// module.exports = router;
