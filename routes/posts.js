const router = require('express').Router();
const Post = require('../models/Post');
const User = require('../models/User');
const { verifySession } = require('./sessionVerify');

router.post('/', verifySession, async (req, res) => {
    const newPost = new Post(req.body);
    newPost.userId = req.session.user._id;
    try {
        const savedPost = await newPost.save();
        res.status(200).json(savedPost);
    } catch (err) {
        res.status(500).json('Error');
    }
});

router.put('/:id', verifySession, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (post.userId === req.session.user._id) {
            await post.updateOne({ $set: req.body });
            res.status(200).json('Post updated');
        } else {
            res.status(403).json('You can update only your post');
        }
    } catch (err) {
        res.status(500).json(err);
    }
});

router.delete('/:id', verifySession, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (post.userId === req.session.user._id) {
            await post.deleteOne();
            res.status(200).json('Post deleted');
        } else {
            res.status(403).json('You can delete only your post');
        }
    } catch (err) {
        res.status(500).json(err);
    }
});

//Like or dislike post
router.put('/:id/like', verifySession, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post.likes.includes(req.session.user._id)) {
            await post.updateOne({ $push: { likes: req.session.user._id } });
            res.status(200).json('Like');
        } else {
            await post.updateOne({ $pull: { likes: req.session.user._id } });
            req.status(200).json('Like removed');
        }
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        res.status(200).json(post);
    } catch (err) {
        res.status(500).json(err);
    }
});

//Get all posts

router.get('/timeline/all', verifySession, async (req, res) => {
    try {
        const currentUser = await User.findById(req.session.user._id);
        const userPosts = await Post.find({ userId: currentUser._id });
        const friendPosts = await Promise.all(
            currentUser.following.map((friendId) => {
                return Post.find({ userId: friendId });
            })
        );
        res.json(userPosts.concat(...friendPosts));
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;