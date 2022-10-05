const router = require('express').Router();
const User = require('../models/User')
const bcrypt = require('bcrypt');
const { verifySession } = require('./sessionVerify');

//Search USER

router.get('/:id', async (req, res) => {

    try {
        const user = await User.findById(req.params.id);
        const { password, updatedAt, ...other } = user._doc;
        res.status(200).json(other);
        res.status(400).json('You are not logged');
    } catch (err) {
        res.status(500).json(err);
    }

});

//Follow and unfollow

router.put('/:id/follow', verifySession, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        const currentUser = await User.findById(req.session.user._id);
        if (!user.followers.includes(req.body.userId)) {
            await user.updateOne({ $push: { followers: req.body.userId } });
            await currentUser.updateOne({ $push: { following: req.body.userId } });
            res.status(200).json('User followed');
        } else {
            res.status(401).json('You already follow this user');
        }
    } catch (err) {
        res.status(500).json(err);
    }
})

router.put('/:id/unfollow', verifySession, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        const currentUser = await User.findById(req.session.user._id);
        if (user.followers.includes(req.body.userId)) {
            await user.updateOne({ $pull: { followers: req.body.userId } });
            await currentUser.updateOne({ $pull: { following: req.body.userId } });
            res.status(200).json('User has been unfollowed');
        } else {
            res.status(403).json("Already unfollowed");
        }
    } catch (err) {
        res.status(500).json(err);
    }
})

//Edit and delete User

router.put('/:id', verifySession, async (req, res) => {
    if (req.params.id === req.session.user._id || req.session.user.isAdmin) {
        if (req.body.password || req.body.isAdmin) res.status(400).json('Unauthorized');
        try {
            await User.findByIdAndUpdate(req.params.id, {
                $set: req.body
            });
            res.status(200).json('User modification success');
        } catch (err) {
            return res.status(500).json(err);
        }
    } else {
        return res.status(403).json('User not found');
    }
})

router.delete('/:id', verifySession, async (req, res) => {
    if (req.params.userId === req.session.user._id || req.body.isAdmin) {
        try {
            await User.findByIdAndDelete(req.params.id);
            res.status(200).json('Account has been deleted');
        } catch (err) {
            return res.status(500).json(err);
        }
    } else {
        return res.status(403).json('User not found');
    }
})

module.exports = router;