const Campaign = require('../models/Campaign');
const Post = require('../models/Post');
const { generateContent, translateText } = require('../services/aiServices');

// Create a new post for a campaign
exports.createPost = async (req, res) => {
    try {
        const { campaignId, topic, platform, tone, style, mediaUrl, targetLang } = req.body;

        if (!campaignId || !platform || !topic) {
            return res.status(400).json({ message: 'Campaign ID, topic, and platform are required.' });
        }

        let content = await generateContent({ topic, platform, tone, style, mediaUrl });

        if (targetLang) {
            content = await translateText(content, targetLang);
        }

        const newPost = new Post({ topic, platform, tone, style, mediaUrl, content, campaign: campaignId });
        await newPost.save();

        // Update the campaign with the new post
        await Campaign.findByIdAndUpdate(campaignId, { $push: { posts: newPost._id } });

        res.status(201).json({ message: 'Post created successfully', post: newPost });
    } catch (error) {
        console.error('Error creating post:', error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
};


// const Post = require('../models/Post');
// const { generateContent, translateText } = require('../services/aiServices');


// exports.createPost = async (req, res) => {
//     try {
//         const { topic, platform, tone, style, mediaUrl, targetLang } = req.body;

//         console.log("req.body: ", req.body);

//         // Validate required properties
//         if (!topic || !platform) {
//             return res.status(400).json({ message: 'Topic and platform are required.' });
//         }

//         // Generate content based on the provided parameters
//         let content = await generateContent({ topic, platform, tone, style, mediaUrl });

//         // Translate content if target language is provided
//         if (targetLang) {
//             content = await translateText(content, targetLang);
//         }

//         // Convert content to a JSON string
//         const contentString = JSON.stringify(content);

//         // Create a new post object
//         const newPost = new Post({
//             topic,
//             platform,
//             tone,
//             style,
//             mediaUrl,
//             content
//         });

//         // Save the post to the database
//         await newPost.save();

//         res.status(201).json({ message: 'Post created successfully', post: newPost });
//     } catch (error) {
//         console.error('Error creating post:', error.message);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// };

// exports.getPosts = async (req, res) => {
//     try {
//         const posts = await Post.find();
//         res.status(200).json(posts);
//     } catch (error) {
//         console.error('Error fetching posts:', error.message);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// };


// exports.getPosts = async (req, res) => {
//     try {
//         // Fetch all posts from the database
//         const posts = await Post.find();
//         res.status(200).json(posts);
//     } catch (error) {
//         console.error('Error fetching posts:', error.message);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// };
